import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (err) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = await showConfirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    setCancelLoading(true);
    try {
      const response = await orderAPI.cancelOrder(orderId);
      if (response.data.success) {
        setOrder(response.data.order);
        showToast('Order cancelled successfully', 'success');
      }
    } catch (err) {
      showToast('Failed to cancel order', 'error');
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Header />
        <div className="error-container">
          <h2>{error || 'Order not found'}</h2>
          <button onClick={() => navigate('/orders')} className="btn-primary">
            Back to Orders
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="order-detail-container">
        <button onClick={() => navigate('/orders')} className="btn-back">
          <i className="fas fa-arrow-left"></i> Back to Orders
        </button>

        <div className="order-detail-card">
          <div className="order-detail-header">
            <div>
              <h1>Order #{order.orderNumber}</h1>
              <p className="order-date">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`status-badge status-${order.orderStatus}`}>
              {order.orderStatus.toUpperCase()}
            </span>
          </div>

          {/* Order Timeline */}
          <div className="order-timeline">
            <h3>Order Status History</h3>
            <div className="timeline">
              {order.statusHistory.map((status, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-status">{status.status.toUpperCase()}</p>
                    <p className="timeline-date">{formatDate(status.timestamp)}</p>
                    {status.note && <p className="timeline-note">{status.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-detail-item">
                  <img src={item.image} alt={item.productName} />
                  <div className="item-info">
                    <h4>{item.productName}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">₹{item.price} each</p>
                  </div>
                  <div className="item-total">
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="shipping-address-section">
            <h3>Shipping Address</h3>
            <div className="address-card">
              <p><strong>{order.shippingAddress.fullname}</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>PIN: {order.shippingAddress.PIN}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="payment-details-section">
            <h3>Payment Details</h3>
            <div className="payment-info">
              <div className="info-row">
                <span>Payment Method:</span>
                <strong>{order.paymentMethod.toUpperCase()}</strong>
              </div>
              <div className="info-row">
                <span>Payment Status:</span>
                <span className={`payment-status status-${order.paymentStatus}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
              {order.paymentId && (
                <div className="info-row">
                  <span>Payment ID:</span>
                  <span>{order.paymentId}</span>
                </div>
              )}
              <div className="info-row total">
                <span>Total Amount:</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          </div>

          {/* Actions */}
          {['pending', 'confirmed'].includes(order.orderStatus) && (
            <div className="order-detail-actions">
              <button
                onClick={handleCancelOrder}
                className="btn-cancel"
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
