import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setSubtotal(0);
      setTotalItems(0);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.success) {
        setItems(res.data.items || []);
        setSubtotal(res.data.subtotal || 0);
        setTotalItems(res.data.totalItems || 0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (variantId, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to your cart.');
    }
    const res = await cartApi.addToCart(variantId, quantity);
    await fetchCart();
    setIsDrawerOpen(true);
    return res;
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await cartApi.updateQuantity(cartItemId, quantity);
    await fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await cartApi.removeItem(cartItemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    setItems([]);
    setSubtotal(0);
    setTotalItems(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        totalItems,
        loading,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
