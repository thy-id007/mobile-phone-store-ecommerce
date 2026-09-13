import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// --- Auth Endpoints ---
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// --- Products Endpoints ---
export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (identifier) => api.get(`/products/${identifier}`),
  compareProducts: (ids) => api.get('/products/compare', { params: { ids } }),
  getBrands: () => api.get('/products/brands'),
  getCategories: () => api.get('/products/categories'),
};

// --- Cart Endpoints ---
export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (variant_id, quantity = 1) => api.post('/cart/add', { variant_id, quantity }),
  updateQuantity: (cartItemId, quantity) => api.put(`/cart/item/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/item/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// --- Orders Endpoints ---
export const orderApi = {
  checkout: (data) => api.post('/orders/checkout', data),
  getUserOrders: () => api.get('/orders'),
  getOrderDetails: (identifier) => api.get(`/orders/${identifier}`),
};

// --- Admin Endpoints ---
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  createProduct: (data) => api.post('/admin/products', data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getCustomers: () => api.get('/admin/customers'),
  uploadImage: (formData) => api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
