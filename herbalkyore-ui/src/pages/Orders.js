import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      confirmed: '#2196f3',
      processing: '#9c27b0',
      shipped: '#ff9800',
      delivered: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#757575';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = await showConfirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;
    try {
      const response = await orderAPI.cancelOrder(orderId);
      if (response.data.success) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
        ));
      }
    } catch (err) {
      showToast('Failed to cancel order. Please try again.', 'error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="orders-container">
        <h1>My Orders</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <i className="fas fa-box-open"></i>
            <h2>No Orders Yet</h2>
            <p>Start shopping to see your orders here!</p>
            <Link to="/" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.productName}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                  <div className="order-actions">
                    <Link to={`/order/${order._id}`} className="btn-view">
                      View Details
                    </Link>
                    {order.orderStatus === 'pending' && (
                      <button className="btn-cancel" onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
                    )}
                  </div>
                </div>

                {order.paymentStatus === 'pending' && (
                  <div className="payment-pending">
                    <i className="fas fa-exclamation-circle"></i>
                    Payment pending - Complete payment to confirm order
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
