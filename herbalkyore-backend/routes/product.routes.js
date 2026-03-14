const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:productId', productController.getProductById);

// Search products
router.get('/search/:query', productController.searchProducts);

// Filter products by type
router.get('/filter/type/:type', productController.getProductsByType);

module.exports = router;
