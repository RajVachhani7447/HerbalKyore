const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Create Cashfree order (payment session)
router.post('/cashfree/create-order', paymentController.createCashfreeOrder);

// Verify Cashfree payment
router.post('/cashfree/verify', paymentController.verifyCashfreePayment);

// Webhook for payment status (Cashfree) - no auth needed for webhooks
router.post('/cashfree/webhook', paymentController.cashfreeWebhook);

module.exports = router;
