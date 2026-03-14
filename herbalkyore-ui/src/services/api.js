import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  firebaseAuth: (idToken) => api.post('/auth/firebase-auth', { idToken }),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addAddress: (address) => api.post('/users/addresses', address),
  updateAddress: (addressId, address) => api.put(`/users/addresses/${addressId}`, address),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
  setDefaultAddress: (addressId) => api.put(`/users/addresses/${addressId}/set-default`),
  getUserOrders: () => api.get('/users/orders'),
};

// Product API
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (productId) => api.get(`/products/${productId}`),
  searchProducts: (query) => api.get(`/products/search/${query}`),
  getProductsByType: (type) => api.get(`/products/filter/type/${type}`),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  getAllOrders: (params) => api.get('/orders/user/all', { params }),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
};

// Payment API
export const paymentAPI = {
  createCashfreeOrder: (orderData) =>
    api.post('/payments/cashfree/create-order', orderData),
  verifyCashfreePayment: (paymentData) =>
    api.post('/payments/cashfree/verify', paymentData),
};

export default api;
