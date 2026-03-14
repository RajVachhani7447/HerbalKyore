const crypto = require('crypto');
const axios = require('axios');
const Order = require('../models/Order.model');

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_VERSION = '2023-08-01';
const CASHFREE_BASE_URL = process.env.CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

// Create Cashfree Order (payment session)
exports.createCashfreeOrder = async (req, res) => {
  try {
    const { amount, orderId, customerName, customerEmail, customerPhone } = req.body;

    const orderPayload = {
      order_id: `HK_${orderId}_${Date.now()}`,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: req.user?.id || `cust_${Date.now()}`,
        customer_name: customerName || 'Customer',
        customer_email: customerEmail || 'customer@herbalkyore.com',
        customer_phone: customerPhone || '9999999999',
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/${orderId}?cf_order_id={order_id}`,
      },
    };

    const response = await axios.post(`${CASHFREE_BASE_URL}/orders`, orderPayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': CASHFREE_API_VERSION,
      },
    });

    const cashfreeOrder = response.data;

    res.json({
      success: true,
      paymentSessionId: cashfreeOrder.payment_session_id,
      cfOrderId: cashfreeOrder.cf_order_id,
      orderId: cashfreeOrder.order_id,
    });

  } catch (error) {
    console.error('Cashfree order creation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.response?.data?.message || error.message,
    });
  }
};

// Verify Cashfree Payment
exports.verifyCashfreePayment = async (req, res) => {
  try {
    const { cfOrderId, orderId } = req.body;

    // Fetch order status from Cashfree
    const response = await axios.get(`${CASHFREE_BASE_URL}/orders/${cfOrderId}`, {
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': CASHFREE_API_VERSION,
      },
    });

    const orderData = response.data;

    if (orderData.order_status === 'PAID') {
      // Get payment details
      const paymentsResponse = await axios.get(
        `${CASHFREE_BASE_URL}/orders/${cfOrderId}/payments`,
        {
          headers: {
            'x-client-id': CASHFREE_APP_ID,
            'x-client-secret': CASHFREE_SECRET_KEY,
            'x-api-version': CASHFREE_API_VERSION,
          },
        }
      );

      const paymentId = paymentsResponse.data?.[0]?.cf_payment_id || cfOrderId;

      // Update order payment status
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'completed';
          order.paymentId = String(paymentId);
          order.orderStatus = 'confirmed';
          order.statusHistory.push({
            status: 'confirmed',
            timestamp: new Date(),
            note: 'Payment completed successfully via Cashfree',
          });
          await order.save();
        }
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: String(paymentId),
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${orderData.order_status}`,
        status: orderData.order_status,
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.response?.data?.message || error.message,
    });
  }
};

// Cashfree Webhook
exports.cashfreeWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];

    // Verify webhook signature
    const rawBody = JSON.stringify(req.body);
    const signatureData = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signatureData)
      .digest('base64');

    if (signature === expectedSignature) {
      const eventType = req.body.type;
      const paymentData = req.body.data;

      switch (eventType) {
        case 'PAYMENT_SUCCESS_WEBHOOK': {
          const cfOrderId = paymentData?.order?.order_id;
          console.log('Payment success:', cfOrderId);
          break;
        }
        case 'PAYMENT_FAILED_WEBHOOK': {
          const cfOrderId = paymentData?.order?.order_id;
          console.log('Payment failed:', cfOrderId);
          break;
        }
        default:
          console.log('Unhandled webhook event:', eventType);
      }

      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
};
