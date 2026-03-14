const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create new order
router.post('/', orderController.createOrder);

// Get order by ID
router.get('/:orderId', orderController.getOrderById);

// Get all user orders
router.get('/user/all', orderController.getUserOrders);

// Update order status (admin only - can add admin middleware)
router.put('/:orderId/status', orderController.updateOrderStatus);

// Cancel order
router.put('/:orderId/cancel', orderController.cancelOrder);

module.exports = router;
