const { pool, query } = require('../config/db');

// Helper to generate readable order number: e.g. ORD-2026-98124
const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${year}-${random}`;
};

// POST /api/orders/checkout
// Transactional order creation
const createOrder = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { shipping_address, payment_method = 'COD', coupon_code, notes } = req.body;

        if (!shipping_address || !shipping_address.recipient_name || !shipping_address.phone || !shipping_address.street_address) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required.'
            });
        }

        await client.query('BEGIN');

        // 1. Fetch user's cart items with latest price & stock
        const cartQuery = `
            SELECT 
                ci.quantity,
                pv.id AS variant_id,
                pv.price,
                pv.stock_quantity,
                pv.color_name,
                pv.ram,
                pv.storage,
                pv.sku,
                p.name AS product_name,
                p.discount_percentage
            FROM cart_items ci
            JOIN product_variants pv ON ci.variant_id = pv.id
            JOIN products p ON pv.product_id = p.id
            WHERE ci.user_id = $1
        `;

        const cartResult = await client.query(cartQuery, [userId]);

        if (cartResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Your shopping cart is empty.'
            });
        }

        const items = cartResult.rows;

        for (const item of items) {
            const discount = parseFloat(item.discount_percentage || 0);
            const basePrice = parseFloat(item.price);
            item.effective_price = Number((basePrice * (1 - discount / 100)).toFixed(2));
        }

        // 2. Validate stock availability for each item
        for (const item of items) {
            if (item.quantity > item.stock_quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: `Item "${item.product_name} (${item.storage})" is out of stock or exceeds available quantity (${item.stock_quantity} left).`
                });
            }
        }

        // 3. Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.effective_price) * item.quantity), 0);

        // 4. Handle coupon discount if provided
        let discountAmount = 0;
        if (coupon_code) {
            const couponResult = await client.query(
                `SELECT * FROM discounts 
                 WHERE code = $1 AND is_active = true 
                 AND (valid_to IS NULL OR valid_to > CURRENT_TIMESTAMP)`,
                [coupon_code.toUpperCase().trim()]
            );

            if (couponResult.rowCount > 0) {
                const coupon = couponResult.rows[0];
                if (subtotal >= parseFloat(coupon.min_spend)) {
                    if (coupon.discount_type === 'percentage') {
                        discountAmount = (subtotal * parseFloat(coupon.value)) / 100;
                    } else {
                        discountAmount = parseFloat(coupon.value);
                    }
                }
            }
        }

        const shippingFee = subtotal >= 500 ? 0 : 25; // Free shipping above $500
        const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);
        const orderNumber = generateOrderNumber();

        // 5. Insert order
        const orderInsertQuery = `
            INSERT INTO orders (
                order_number, user_id, shipping_address, payment_method, payment_status,
                order_status, subtotal, discount_amount, shipping_fee, total_amount, notes
            )
            VALUES ($1, $2, $3, $4, 'pending', 'pending', $5, $6, $7, $8, $9)
            RETURNING id, order_number, order_status, total_amount, created_at
        `;

        const orderResult = await client.query(orderInsertQuery, [
            orderNumber,
            userId,
            JSON.stringify(shipping_address),
            payment_method,
            subtotal.toFixed(2),
            discountAmount.toFixed(2),
            shippingFee.toFixed(2),
            totalAmount.toFixed(2),
            notes || null
        ]);

        const order = orderResult.rows[0];

        // 6. Insert order items & deduct stock
        for (const item of items) {
            const variantDetails = `Color: ${item.color_name} | RAM: ${item.ram} | Storage: ${item.storage}`;
            const itemTotal = (parseFloat(item.effective_price) * item.quantity).toFixed(2);

            await client.query(
                `INSERT INTO order_items (order_id, variant_id, product_name, variant_details, unit_price, quantity, total_price)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [order.id, item.variant_id, item.product_name, variantDetails, item.effective_price, item.quantity, itemTotal]
            );

            // Deduct variant stock
            await client.query(
                `UPDATE product_variants 
                 SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $2`,
                [item.quantity, item.variant_id]
            );
        }

        // 7. Clear user cart
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            data: order
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// GET /api/orders
const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const ordersQuery = `
            SELECT 
                o.id,
                o.order_number,
                o.payment_method,
                o.payment_status,
                o.order_status,
                o.subtotal,
                o.discount_amount,
                o.shipping_fee,
                o.total_amount,
                o.tracking_number,
                o.created_at
            FROM orders o
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
        `;

        const { rows } = await query(ordersQuery, [userId]);

        if (rows.length > 0) {
            const orderIds = rows.map(o => o.id);
            const placeholders = orderIds.map((_, i) => `$${i + 1}`).join(',');
            const itemsRes = await query(
                `SELECT id, order_id, variant_id, product_name, variant_details, unit_price, quantity, total_price
                 FROM order_items
                 WHERE order_id IN (${placeholders})`,
                orderIds
            );

            const itemsByOrder = {};
            for (const item of itemsRes.rows) {
                if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
                itemsByOrder[item.order_id].push(item);
            }

            for (const o of rows) {
                o.items = itemsByOrder[o.id] || [];
            }
        }

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/orders/:identifier (order_number or id)
const getOrderDetails = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { identifier } = req.params;
        const isAdmin = req.user.role === 'admin';

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        const condition = isUuid ? 'o.id = $1' : 'o.order_number = $1';

        let sql = `
            SELECT 
                o.id,
                o.order_number,
                o.user_id,
                o.shipping_address,
                o.payment_method,
                o.payment_status,
                o.order_status,
                o.subtotal,
                o.discount_amount,
                o.shipping_fee,
                o.total_amount,
                o.tracking_number,
                o.notes,
                o.created_at,
                u.full_name AS customer_name,
                u.email AS customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE ${condition}
        `;

        const params = [identifier];
        if (!isAdmin) {
            sql += ' AND o.user_id = $2';
            params.push(userId);
        }

        const { rows } = await query(sql, params);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        const order = rows[0];
        const itemsRes = await query(
            `SELECT id, variant_id, product_name, variant_details, unit_price, quantity, total_price
             FROM order_items
             WHERE order_id = $1`,
            [order.id]
        );
        order.items = itemsRes.rows;

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails
};
