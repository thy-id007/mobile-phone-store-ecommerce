const { query } = require('../config/db');

// GET /api/reviews/product/:productId
// Public: Get all reviews for a product with summary stats
const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const reviewsQuery = `
            SELECT 
                r.id,
                r.rating,
                r.title,
                r.comment,
                r.created_at,
                u.id AS user_id,
                u.full_name AS user_name,
                u.avatar_url
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = $1
            ORDER BY r.created_at DESC
        `;

        const { rows } = await query(reviewsQuery, [productId]);

        // Calculate summary
        const total = rows.length;
        const avgRating = total > 0 
            ? Number((rows.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)) 
            : 0;

        const distribution = {
            5: rows.filter(r => r.rating === 5).length,
            4: rows.filter(r => r.rating === 4).length,
            3: rows.filter(r => r.rating === 3).length,
            2: rows.filter(r => r.rating === 2).length,
            1: rows.filter(r => r.rating === 1).length,
        };

        res.json({
            success: true,
            data: {
                reviews: rows,
                summary: {
                    total,
                    averageRating: avgRating,
                    distribution
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/reviews/product/:productId
// Authenticated Customer: Post a review
const addReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { rating, title, comment } = req.body;

        const numRating = parseInt(rating, 10);
        if (!numRating || numRating < 1 || numRating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be an integer between 1 and 5 stars.'
            });
        }

        if (!comment || comment.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Review comment must be at least 5 characters long.'
            });
        }

        // Verify product exists
        const productCheck = await query('SELECT id, name FROM products WHERE id = $1', [productId]);
        if (productCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        // Check if user already reviewed this product
        const existing = await query(
            'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
            [productId, userId]
        );

        if (existing.rowCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a review for this product. You can update your existing review.'
            });
        }

        const insertQuery = `
            INSERT INTO reviews (product_id, user_id, rating, title, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, product_id, user_id, rating, title, comment, created_at
        `;

        const result = await query(insertQuery, [
            productId,
            userId,
            numRating,
            title ? title.trim() : null,
            comment.trim()
        ]);

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully.',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/reviews/:id
// Authenticated: Update own review
const updateReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { rating, title, comment } = req.body;

        const reviewCheck = await query('SELECT * FROM reviews WHERE id = $1', [id]);
        if (reviewCheck.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Review not found.' });
        }

        const review = reviewCheck.rows[0];

        // Only author or admin can update
        if (review.user_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this review.' });
        }

        const numRating = rating ? parseInt(rating, 10) : review.rating;
        const newTitle = title !== undefined ? title.trim() : review.title;
        const newComment = comment !== undefined ? comment.trim() : review.comment;

        const updateQuery = `
            UPDATE reviews
            SET rating = $1, title = $2, comment = $3
            WHERE id = $4
            RETURNING id, product_id, user_id, rating, title, comment, created_at
        `;

        const result = await query(updateQuery, [numRating, newTitle, newComment, id]);

        res.json({
            success: true,
            message: 'Review updated successfully.',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/reviews/:id
// Authenticated Author or Admin: Delete a review
const deleteReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const reviewCheck = await query('SELECT * FROM reviews WHERE id = $1', [id]);
        if (reviewCheck.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Review not found.' });
        }

        const review = reviewCheck.rows[0];

        // Check ownership or admin
        if (review.user_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review.' });
        }

        await query('DELETE FROM reviews WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Review deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/reviews/admin/all
// Admin: Moderate all reviews across store
const getAllReviewsAdmin = async (req, res, next) => {
    try {
        const reviewsQuery = `
            SELECT 
                r.id,
                r.rating,
                r.title,
                r.comment,
                r.created_at,
                p.id AS product_id,
                p.name AS product_name,
                p.slug AS product_slug,
                u.id AS user_id,
                u.full_name AS user_name,
                u.email AS user_email
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 50
        `;

        const { rows } = await query(reviewsQuery);

        res.json({
            success: true,
            data: {
                reviews: rows,
                total: rows.length
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    getAllReviewsAdmin
};
