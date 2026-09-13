const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrderDetails
} = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/checkout', createOrder);
router.get('/', getUserOrders);
router.get('/:identifier', getOrderDetails);

module.exports = router;
