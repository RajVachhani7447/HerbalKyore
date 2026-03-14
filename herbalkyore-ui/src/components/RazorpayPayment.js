import React from 'react';
import { paymentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayPayment = () => {
  const { showToast } = useToast();
  const initiatePayment = async (amount, orderId, onSuccess, onFailure) => {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      showToast('Failed to load payment gateway. Please try again.', 'error');
      onFailure && onFailure('Script load failed');
      return;
    }

    try {
      // Create Razorpay order
      const response = await paymentAPI.createRazorpayOrder(amount);
      
      if (!response.data.success) {
        throw new Error('Failed to create payment order');
      }

      const { order: razorpayOrder, key } = response.data;

      // Razorpay options
      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'HerbalKyore',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentAPI.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,
            });

            if (verifyResponse.data.success) {
              onSuccess && onSuccess(response.razorpay_payment_id, verifyResponse.data);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure && onFailure('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#2e7d32',
        },
        modal: {
          ondismiss: function() {
            onFailure && onFailure('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      onFailure && onFailure(error.message);
    }
  };

  return { initiatePayment };
};

export default RazorpayPayment;
