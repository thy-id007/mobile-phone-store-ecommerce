const { query } = require('../config/db');

// GET /api/cart
// Fetches the authenticated user's cart with current variant stock, price, and discounts
const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cartQuery = `
            SELECT 
                ci.id AS cart_item_id,
                ci.quantity,
                ci.created_at,
                pv.id AS variant_id,
                pv.color_name,
                pv.color_hex,
                pv.ram,
                pv.storage,
                pv.sku,
                pv.price,
                pv.stock_quantity,
                pv.variant_image,
                p.id AS product_id,
                p.name AS product_name,
                p.slug AS product_slug,
                p.discount_percentage
            FROM cart_items ci
            JOIN product_variants pv ON ci.variant_id = pv.id
            JOIN products p ON pv.product_id = p.id
            WHERE ci.user_id = $1
            ORDER BY ci.created_at DESC
        `;

        const { rows } = await query(cartQuery, [userId]);

        for (const item of rows) {
            const discount = parseFloat(item.discount_percentage || 0);
            const basePrice = parseFloat(item.price);
            const effectivePrice = Number((basePrice * (1 - discount / 100)).toFixed(2));
            item.effective_price = effectivePrice;
            item.item_total = Number((effectivePrice * item.quantity).toFixed(2));
        }

        const subtotal = rows.reduce((sum, item) => sum + parseFloat(item.item_total || 0), 0);
        const totalItems = rows.reduce((sum, item) => sum + item.quantity, 0);

        res.json({
            success: true,
            data: {
                items: rows,
                subtotal: parseFloat(subtotal.toFixed(2)),
                totalItems
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/cart/add
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { variant_id, quantity = 1 } = req.body;

        if (!variant_id) {
            return res.status(400).json({
                success: false,
                message: 'variant_id is required.'
            });
        }

        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1.'
            });
        }

        // Check variant existence and stock
        const variantCheck = await query(
            `SELECT pv.id, pv.stock_quantity, p.name 
             FROM product_variants pv
             JOIN products p ON pv.product_id = p.id
             WHERE pv.id = $1 AND p.status = 'active'`,
            [variant_id]
        );

        if (variantCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product variant is not available.'
            });
        }

        const variant = variantCheck.rows[0];

        // Check if item already in cart
        const existingCartItem = await query(
            'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND variant_id = $2',
            [userId, variant_id]
        );

        let newQuantity = qty;
        if (existingCartItem.rowCount > 0) {
            newQuantity = existingCartItem.rows[0].quantity + qty;
        }

        if (newQuantity > variant.stock_quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${variant.stock_quantity} units available in stock.`
            });
        }

        if (existingCartItem.rowCount > 0) {
            await query(
                'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [newQuantity, existingCartItem.rows[0].id]
            );
        } else {
            await query(
                'INSERT INTO cart_items (user_id, variant_id, quantity) VALUES ($1, $2, $3)',
                [userId, variant_id, newQuantity]
            );
        }

        res.json({
            success: true,
            message: `Added ${variant.name} to cart.`
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/cart/item/:id
const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItemId = req.params.id;
        const { quantity } = req.body;

        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1.'
            });
        }

        // Verify ownership and stock
        const itemResult = await query(
            `SELECT ci.id, pv.stock_quantity
             FROM cart_items ci
             JOIN product_variants pv ON ci.variant_id = pv.id
             WHERE ci.id = $1 AND ci.user_id = $2`,
            [cartItemId, userId]
        );

        if (itemResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found.'
            });
        }

        const item = itemResult.rows[0];
        if (qty > item.stock_quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${item.stock_quantity} units available in stock.`
            });
        }

        await query(
            'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [qty, cartItemId]
        );

        res.json({
            success: true,
            message: 'Cart quantity updated.'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/cart/item/:id
const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItemId = req.params.id;

        const result = await query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
            [cartItemId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found.'
            });
        }

        res.json({
            success: true,
            message: 'Item removed from cart.'
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/cart/clear
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        res.json({
            success: true,
            message: 'Cart cleared.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
