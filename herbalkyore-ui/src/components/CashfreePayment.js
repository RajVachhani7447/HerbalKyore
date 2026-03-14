import { paymentAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

// Load Cashfree JS SDK
const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CashfreePayment = () => {
  const { showToast } = useToast();
  const initiatePayment = async (amount, orderId, onSuccess, onFailure) => {
    const scriptLoaded = await loadCashfreeScript();

    if (!scriptLoaded) {
      showToast('Failed to load payment gateway. Please try again.', 'error');
      onFailure && onFailure('Script load failed');
      return;
    }

    try {
      // Create Cashfree order via backend
      const response = await paymentAPI.createCashfreeOrder({
        amount,
        orderId,
      });

      if (!response.data.success) {
        throw new Error('Failed to create payment order');
      }

      const { paymentSessionId } = response.data;

      // Initialize Cashfree SDK
      const cashfree = window.Cashfree({
        mode: process.env.REACT_APP_CASHFREE_ENV === 'production' ? 'production' : 'sandbox',
      });

      // Open Cashfree checkout
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: '_modal',
      };

      cashfree.checkout(checkoutOptions).then((result) => {
        if (result.error) {
          console.error('Payment error:', result.error);
          onFailure && onFailure(result.error.message || 'Payment failed');
          return;
        }

        if (result.redirect) {
          // Payment will be redirected — handled by return_url
          return;
        }

        if (result.paymentDetails) {
          // Payment completed in modal — verify it
          const cfOrderId = response.data.cfOrderId;
          paymentAPI.verifyCashfreePayment({
            cfOrderId,
            orderId,
          }).then((verifyResponse) => {
            if (verifyResponse.data.success) {
              onSuccess && onSuccess(verifyResponse.data.paymentId, verifyResponse.data);
            } else {
              onFailure && onFailure('Payment verification failed');
            }
          }).catch((err) => {
            console.error('Verification error:', err);
            onFailure && onFailure('Payment verification failed');
          });
        }
      });

    } catch (error) {
      console.error('Payment initiation error:', error);
      onFailure && onFailure(error.message);
    }
  };

  return { initiatePayment };
};

export default CashfreePayment;
