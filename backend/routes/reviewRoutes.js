const express = require('express');
const router = express.Router();
const {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    getAllReviewsAdmin
} = require('../controllers/reviewController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public: view reviews for a product
router.get('/product/:productId', getProductReviews);

// Customer: add review
router.post('/product/:productId', verifyToken, addReview);

// Customer / Admin: update review
router.put('/:id', verifyToken, updateReview);

// Customer / Admin: delete review
router.delete('/:id', verifyToken, deleteReview);

// Admin: view all reviews for moderation
router.get('/admin/all', verifyToken, requireAdmin, getAllReviewsAdmin);

module.exports = router;
