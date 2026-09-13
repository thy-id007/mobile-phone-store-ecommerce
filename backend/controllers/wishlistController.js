const { query } = require('../config/db');

// GET /api/wishlist
const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const wishlistQuery = `
            SELECT 
                w.id AS wishlist_id,
                w.created_at AS added_at,
                p.id AS product_id,
                p.name,
                p.slug,
                p.model,
                p.base_price,
                p.discount_percentage,
                p.display_spec,
                p.processor_spec,
                p.camera_spec,
                p.battery_spec,
                b.name AS brand_name,
                c.name AS category_name,
                COALESCE(
                    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1),
                    (SELECT variant_image FROM product_variants pv WHERE pv.product_id = p.id AND pv.variant_image IS NOT NULL LIMIT 1)
                ) AS primary_image
            FROM wishlists w
            JOIN products p ON w.product_id = p.id
            JOIN brands b ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            WHERE w.user_id = $1
            ORDER BY w.created_at DESC
        `;

        const { rows } = await query(wishlistQuery, [userId]);

        res.json({
            success: true,
            data: {
                items: rows,
                total: rows.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/wishlist/:productId
const addToWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // Verify product exists
        const productCheck = await query('SELECT id, name FROM products WHERE id = $1', [productId]);
        if (productCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        // Upsert wishlist
        const insertQuery = `
            INSERT INTO wishlists (user_id, product_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, product_id) DO NOTHING
            RETURNING id, created_at
        `;

        const result = await query(insertQuery, [userId, productId]);

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist.',
            data: {
                product_id: productId,
                is_wishlisted: true
            }
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await query('DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2', [userId, productId]);

        res.json({
            success: true,
            message: 'Product removed from wishlist.',
            data: {
                product_id: productId,
                is_wishlisted: false
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/wishlist/check/:productId
const checkWishlistStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const result = await query(
            'SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        res.json({
            success: true,
            data: {
                is_wishlisted: result.rowCount > 0
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
};
