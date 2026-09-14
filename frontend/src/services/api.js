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

import fallbackData from './fallbackData.json';

// --- Auth Endpoints ---
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// --- Products Endpoints (with automatic static fallback for GitHub Pages demo) ---
export const productApi = {
  getProducts: async (params = {}) => {
    try {
      return await api.get('/products', { params });
    } catch (err) {
      console.warn('[API Fallback] Using offline catalog for demo:', err.message);
      let list = [...(fallbackData.products || [])];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || (p.model && p.model.toLowerCase().includes(q)) || (p.brand_name && p.brand_name.toLowerCase().includes(q)));
      }
      if (params.brand) {
        list = list.filter(p => p.brand_slug && p.brand_slug.toLowerCase() === params.brand.toLowerCase());
      }
      if (params.category) {
        list = list.filter(p => p.category_slug && p.category_slug.toLowerCase() === params.category.toLowerCase());
      }
      if (params.is_featured === 'true') {
        list = list.filter(p => p.is_featured);
      }
      if (params.limit) {
        list = list.slice(0, parseInt(params.limit, 10));
      }
      return { success: true, count: list.length, total: list.length, data: list };
    }
  },
  getProduct: async (identifier) => {
    try {
      return await api.get(`/products/${identifier}`);
    } catch (err) {
      console.warn('[API Fallback] Using offline product detail for:', identifier);
      const product = (fallbackData.products || []).find(p => p.slug === identifier || p.id === identifier);
      if (product) return { success: true, data: product };
      throw err;
    }
  },
  compareProducts: async (ids) => {
    try {
      return await api.get('/products/compare', { params: { ids } });
    } catch (err) {
      console.warn('[API Fallback] Comparing from offline catalog');
      const idArr = Array.isArray(ids) ? ids : (ids ? ids.split(',') : []);
      const matched = (fallbackData.products || []).filter(p => idArr.includes(p.id) || idArr.includes(p.slug));
      return { success: true, data: matched };
    }
  },
  getBrands: async () => {
    try {
      return await api.get('/products/brands');
    } catch (err) {
      return { success: true, data: fallbackData.brands || [] };
    }
  },
  getCategories: async () => {
    try {
      return await api.get('/products/categories');
    } catch (err) {
      return { success: true, data: fallbackData.categories || [] };
    }
  },
};

// --- Cart Endpoints ---
export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (variant_id, quantity = 1) => api.post('/cart/add', { variant_id, quantity }),
  updateQuantity: (cartItemId, quantity) => api.put(`/cart/item/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/item/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// --- Wishlist Endpoints ---
export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
};

// --- Orders Endpoints ---
export const orderApi = {
  checkout: async (data) => {
    try {
      return await api.post('/orders/checkout', data);
    } catch (err) {
      console.warn('[API Fallback] Offline checkout simulation');
      return {
        success: true,
        data: {
          order: {
            id: 'demo-' + Date.now(),
            order_number: 'NEX-' + Math.floor(100000 + Math.random() * 900000),
            total_amount: data.totalAmount || 1049.00,
            payment_method: data.payment_method || 'Bank Transfer',
            payment_status: 'pending',
            created_at: new Date().toISOString()
          }
        }
      };
    }
  },
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
