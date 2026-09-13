const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

// All cart routes require authenticated customer
router.use(verifyToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem);
router.delete('/item/:id', removeCartItem);
router.delete('/clear', clearCart);

module.exports = router;
