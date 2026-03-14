import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, userAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import CashfreePayment from '../components/CashfreePayment';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Address = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { initiatePayment } = CashfreePayment();
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    PIN: ''
  });

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        const addresses = response.data.user.addresses || [];
        setSavedAddresses(addresses);
        if (addresses.length === 0) {
          setShowForm(true);
        } else {
          const defaultAddr = addresses.find(a => a.isDefault);
          setSelectedAddressId(defaultAddr ? defaultAddr._id : addresses[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
      setShowForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getShippingAddress = () => {
    if (showForm) {
      return {
        fullname: formData.fullname,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        PIN: formData.PIN,
      };
    }
    const selected = savedAddresses.find(a => a._id === selectedAddressId);
    return selected ? {
      fullname: selected.fullname,
      phone: selected.phone,
      address: selected.address,
      city: selected.city,
      state: selected.state,
      PIN: selected.PIN,
    } : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Cart is empty. Please add items before submitting.', 'warning');
      navigate('/');
      return;
    }

    const shippingAddress = getShippingAddress();
    if (!shippingAddress) {
      showToast('Please select or enter a shipping address.', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: 'cashfree',
      };

      const response = await orderAPI.createOrder(orderData);
      
      if (response.data.success) {
        const order = response.data.order;
        
        initiatePayment(
          order.totalAmount,
          order._id,
          (paymentId) => {
            showToast('Payment successful! Your order has been placed.', 'success');
            clearCart();
            navigate(`/order/${order._id}`);
          },
          (error) => {
            showToast(`Payment failed: ${error}. Order created but payment pending.`, 'error');
            navigate(`/order/${order._id}`);
          }
        );
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAddresses) {
    return (
      <div className="address-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading addresses...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="address-page">
      <Header />
      <div className="form-container">
        <h2>Shipping Address</h2>

        {/* Saved Addresses */}
        {savedAddresses.length > 0 && !showForm && (
          <div className="saved-addresses-section">
            <div className="saved-addresses-list">
              {savedAddresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`saved-address-card ${selectedAddressId === addr._id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddressId(addr._id)}
                >
                  <div className="saved-address-radio">
                    <div className={`radio-circle ${selectedAddressId === addr._id ? 'active' : ''}`}>
                      {selectedAddressId === addr._id && <div className="radio-dot"></div>}
                    </div>
                  </div>
                  <div className="saved-address-details">
                    <p className="saved-address-name">{addr.fullname}</p>
                    <p>{addr.address}</p>
                    <p>{addr.city}, {addr.state} - {addr.PIN}</p>
                    <p className="saved-address-phone">Phone: {addr.phone}</p>
                    {addr.isDefault && <span className="default-badge">Default</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="saved-addresses-actions">
              <button
                type="button"
                className="btn-add-new-address"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus"></i> Use a New Address
              </button>
              <button
                type="button"
                className="btn-continue-payment"
                onClick={handleSubmit}
                disabled={submitting || !selectedAddressId}
              >
                {submitting ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* New Address Form */}
        {showForm && (
          <>
            {savedAddresses.length > 0 && (
              <button
                type="button"
                className="btn-back-to-saved"
                onClick={() => setShowForm(false)}
              >
                <i className="fas fa-arrow-left"></i> Back to Saved Addresses
              </button>
            )}
            <form id="addressForm" onSubmit={handleSubmit} style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e8ece6', boxShadow: '0 4px 6px rgba(0,0,0,0.04)' }}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <textarea
                  id="address"
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="zip">PIN Code</label>
                <input
                  type="text"
                  id="zip"
                  name="PIN"
                  value={formData.PIN}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Address;
