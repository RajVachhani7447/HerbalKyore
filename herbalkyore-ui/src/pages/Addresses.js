import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    PIN: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setAddresses(response.data.user.addresses || []);
      }
    } catch (err) {
      setError('Failed to load addresses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ fullname: '', phone: '', address: '', city: '', state: '', PIN: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addr) => {
    setFormData({
      fullname: addr.fullname || '',
      phone: addr.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      PIN: addr.PIN || '',
    });
    setEditingId(addr._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (editingId) {
        response = await userAPI.updateAddress(editingId, formData);
      } else {
        response = await userAPI.addAddress(formData);
      }
      if (response.data.success) {
        setAddresses(response.data.addresses);
        resetForm();
      }
    } catch (err) {
      showToast('Failed to save address. Please try again.', 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = await showConfirm('Delete this address?');
    if (!confirmed) return;
    try {
      const response = await userAPI.deleteAddress(addressId);
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      showToast('Failed to delete address.', 'error');
      console.error(err);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await userAPI.setDefaultAddress(addressId);
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (err) {
      showToast('Failed to set default address.', 'error');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
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
    <div>
      <Header />
      <div className="addresses-container">
        <div className="addresses-header">
          <button onClick={() => navigate('/profile')} className="btn-back">
            <i className="fas fa-arrow-left"></i> Back to Profile
          </button>
          <h1>Manage Addresses</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!showForm && (
          <button className="btn-add-address" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus"></i> Add New Address
          </button>
        )}

        {showForm && (
          <div className="address-form-card">
            <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <textarea id="address" name="address" rows="2" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="PIN">PIN Code</label>
                  <input type="text" id="PIN" name="PIN" value={formData.PIN} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="empty-orders">
            <i className="fas fa-map-marker-alt"></i>
            <h2>No Saved Addresses</h2>
            <p>Add an address to make checkout faster.</p>
          </div>
        ) : (
          <div className="addresses-list">
            {addresses.map((addr) => (
              <div key={addr._id} className={`address-list-card ${addr.isDefault ? 'default' : ''}`}>
                <div className="address-list-content">
                  {addr.isDefault && <span className="default-badge">Default</span>}
                  <p className="address-name"><strong>{addr.fullname}</strong></p>
                  <p>{addr.address}</p>
                  <p>{addr.city}, {addr.state} — {addr.PIN}</p>
                  <p>Phone: {addr.phone}</p>
                </div>
                <div className="address-list-actions">
                  <button className="btn-edit" onClick={() => handleEdit(addr)}>
                    <i className="fas fa-pen"></i> Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(addr._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                  {!addr.isDefault && (
                    <button className="btn-set-default" onClick={() => handleSetDefault(addr._id)}>
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Addresses;
