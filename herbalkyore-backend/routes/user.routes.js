const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Add address
router.post('/addresses', userController.addAddress);

// Update address
router.put('/addresses/:addressId', userController.updateAddress);

// Delete address
router.delete('/addresses/:addressId', userController.deleteAddress);

// Set default address
router.put('/addresses/:addressId/set-default', userController.setDefaultAddress);

// Get user orders
router.get('/orders', userController.getUserOrders);

module.exports = router;
