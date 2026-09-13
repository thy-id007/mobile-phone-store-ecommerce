const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(verifyToken);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlistStatus);

module.exports = router;
