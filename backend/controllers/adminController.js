const { pool, query } = require('../config/db');

// GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
    try {
        // Run parallel queries for dashboard overview
        const [
            revenueResult,
            ordersCountResult,
            customersCountResult,
            productsCountResult,
            lowStockResult,
            recentOrdersResult
        ] = await Promise.all([
            query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE payment_status = 'paid' OR order_status = 'delivered'"),
            query("SELECT COUNT(*) AS total_orders FROM orders"),
            query("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'"),
            query("SELECT COUNT(*) AS total_products FROM products"),
            query("SELECT COUNT(*) AS low_stock_count FROM product_variants WHERE stock_quantity <= 10"),
            query(`
                SELECT o.id, o.order_number, o.total_amount, o.order_status, o.payment_status, o.created_at, u.full_name AS customer_name
                FROM orders o
                JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
                LIMIT 6
            `)
        ]);

        res.json({
            success: true,
            data: {
                totalRevenue: parseFloat(revenueResult.rows[0].total_revenue),
                totalOrders: parseInt(ordersCountResult.rows[0].total_orders, 10),
                totalCustomers: parseInt(customersCountResult.rows[0].total_customers, 10),
                totalProducts: parseInt(productsCountResult.rows[0].total_products, 10),
                lowStockCount: parseInt(lowStockResult.rows[0].low_stock_count, 10),
                recentOrders: recentOrdersResult.rows
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/orders
const getAllOrders = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
        const params = [];
        let where = '';

        if (status) {
            params.push(status);
            where = `WHERE o.order_status = $${params.length}`;
        }

        const countResult = await query(`SELECT COUNT(*) FROM orders o ${where}`, params);
        const totalItems = parseInt(countResult.rows[0].count, 10);

        params.push(parseInt(limit, 10));
        const limitParam = `$${params.length}`;
        params.push(offset);
        const offsetParam = `$${params.length}`;

        const ordersResult = await query(`
            SELECT 
                o.id, o.order_number, o.order_status, o.payment_method, o.payment_status,
                o.total_amount, o.tracking_number, o.created_at,
                u.full_name AS customer_name, u.email AS customer_email,
                (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ${where}
            ORDER BY o.created_at DESC
            LIMIT ${limitParam} OFFSET ${offsetParam}
        `, params);

        res.json({
            success: true,
            pagination: {
                totalItems,
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalItems / parseInt(limit, 10))
            },
            data: ordersResult.rows
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { order_status, payment_status, tracking_number } = req.body;

        const result = await query(`
            UPDATE orders
            SET 
                order_status = COALESCE($1, order_status),
                payment_status = COALESCE($2, payment_status),
                tracking_number = COALESCE($3, tracking_number),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, order_number, order_status, payment_status, tracking_number, updated_at
        `, [order_status, payment_status, tracking_number, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully.',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/products (Create phone with variants)
const createProduct = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const {
            name,
            brand_id,
            category_id,
            model,
            description,
            base_price,
            discount_percentage = 0,
            display_spec,
            processor_spec,
            camera_spec,
            battery_spec,
            os_spec,
            is_featured = false,
            variants = [],
            specifications = []
        } = req.body;

        if (!name || !brand_id || !category_id || !base_price) {
            return res.status(400).json({
                success: false,
                message: 'Name, brand, category, and base price are required.'
            });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

        await client.query('BEGIN');

        // Insert product
        const productResult = await client.query(`
            INSERT INTO products (
                brand_id, category_id, name, slug, model, description, base_price,
                discount_percentage, display_spec, processor_spec, camera_spec,
                battery_spec, os_spec, is_featured
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `, [
            brand_id, category_id, name, slug, model || name, description,
            base_price, discount_percentage, display_spec, processor_spec,
            camera_spec, battery_spec, os_spec, is_featured
        ]);

        const newProduct = productResult.rows[0];

        // Insert variants if provided
        for (let i = 0; i < variants.length; i++) {
            const v = variants[i];
            const sku = v.sku || `${slug.toUpperCase()}-${v.storage || '128'}-${i}`;
            await client.query(`
                INSERT INTO product_variants (
                    product_id, color_name, color_hex, ram, storage, sku, price,
                    stock_quantity, variant_image, is_default
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [
                newProduct.id, v.color_name || 'Default', v.color_hex || '#000000',
                v.ram || '8GB', v.storage || '128GB', sku, v.price || base_price,
                v.stock_quantity || 0, v.variant_image || null, i === 0
            ]);
        }

        // Insert specs if provided
        for (let i = 0; i < specifications.length; i++) {
            const s = specifications[i];
            await client.query(`
                INSERT INTO product_specifications (product_id, spec_group, spec_name, spec_value, display_order)
                VALUES ($1, $2, $3, $4, $5)
            `, [newProduct.id, s.spec_group, s.spec_name, s.spec_value, i]);
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Product created successfully.',
            data: newProduct
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// DELETE /api/admin/products/:id
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM products WHERE id = $1 RETURNING id, name', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        res.json({
            success: true,
            message: `Product "${result.rows[0].name}" deleted successfully.`
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/admin/customers
const getCustomers = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT 
                u.id, u.full_name, u.email, u.phone, u.created_at,
                COUNT(o.id) AS total_orders,
                COALESCE(SUM(o.total_amount), 0) AS total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role = 'customer'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    createProduct,
    deleteProduct,
    getCustomers
};
