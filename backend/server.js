const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: [clientUrl, 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Mobile Phone Store E-Commerce API',
        timestamp: new Date().toISOString()
    });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(`🚀 Mobile Phone Store API Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use by another process. Please close it and restart.`);
    } else {
        console.error(`❌ Server error:`, err);
    }
});

module.exports = app;
