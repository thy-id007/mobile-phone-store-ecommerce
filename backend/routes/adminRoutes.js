const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    createProduct,
    deleteProduct,
    getCustomers
} = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All admin routes require token AND admin role
router.use(verifyToken, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/products', createProduct);
router.delete('/products/:id', deleteProduct);
router.get('/customers', getCustomers);

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
        success: true,
        message: 'Image uploaded successfully.',
        imageUrl
    });
});

module.exports = router;
