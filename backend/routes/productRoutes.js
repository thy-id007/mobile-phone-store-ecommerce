const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductByIdentifier,
    compareProducts,
    getBrands,
    getCategories
} = require('../controllers/productController');

// Public catalog routes
router.get('/', getProducts);
router.get('/compare', compareProducts);
router.get('/brands', getBrands);
router.get('/categories', getCategories);
router.get('/:identifier', getProductByIdentifier);

module.exports = router;
