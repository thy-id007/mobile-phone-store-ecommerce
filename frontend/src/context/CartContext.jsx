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

  const GUEST_CART_KEY = 'nexus_guest_cart';

  const loadGuestCart = () => {
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed.items || []);
        setSubtotal(parsed.subtotal || 0);
        setTotalItems(parsed.totalItems || 0);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse guest cart:', e);
    }
    return { items: [], subtotal: 0, totalItems: 0 };
  };

  const saveGuestCart = (cartItems) => {
    const sub = cartItems.reduce((sum, it) => sum + (parseFloat(it.effective_price || it.price || 0) * it.quantity), 0);
    const count = cartItems.reduce((sum, it) => sum + it.quantity, 0);
    const cartData = { items: cartItems, subtotal: sub, totalItems: count };
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartData));
    } catch (e) {
      console.warn('Failed to save guest cart:', e);
    }
    setItems(cartItems);
    setSubtotal(sub);
    setTotalItems(count);
  };

  const fetchCart = async () => {
    if (!user) {
      loadGuestCart();
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.success && res.data) {
        setItems(res.data.items || []);
        setSubtotal(res.data.subtotal || 0);
        setTotalItems(res.data.totalItems || 0);
      } else {
        loadGuestCart();
      }
    } catch (err) {
      console.warn('Backend cart unavailable, using local cart:', err.message);
      loadGuestCart();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (variantId, quantity = 1, itemSnapshot = null) => {
    if (user) {
      try {
        const res = await cartApi.addToCart(variantId, quantity);
        await fetchCart();
        setIsDrawerOpen(true);
        return res;
      } catch (err) {
        console.warn('API add to cart failed, falling back to local storage:', err.message);
      }
    }

    // Local / Guest Cart Handling
    const currentItems = [...items];
    const existingIndex = currentItems.findIndex(
      (it) => it.variant_id === variantId || it.cart_item_id === variantId
    );

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
      currentItems[existingIndex].item_total = (
        parseFloat(currentItems[existingIndex].effective_price || currentItems[existingIndex].price || 0) * currentItems[existingIndex].quantity
      ).toFixed(2);
    } else {
      const price = itemSnapshot?.effective_price || itemSnapshot?.price || 999;
      currentItems.push({
        cart_item_id: 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        variant_id: variantId,
        product_name: itemSnapshot?.product_name || 'Flagship Smartphone',
        product_slug: itemSnapshot?.product_slug || '',
        variant_image: itemSnapshot?.variant_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80',
        color_name: itemSnapshot?.color_name || 'Titanium',
        storage: itemSnapshot?.storage || '256GB',
        ram: itemSnapshot?.ram || '12GB',
        effective_price: parseFloat(price).toFixed(2),
        price: parseFloat(price).toFixed(2),
        quantity: quantity,
        item_total: (parseFloat(price) * quantity).toFixed(2),
      });
    }

    saveGuestCart(currentItems);
    setIsDrawerOpen(true);
    return { success: true };
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (user && !cartItemId.toString().startsWith('guest-')) {
      try {
        await cartApi.updateQuantity(cartItemId, quantity);
        await fetchCart();
        return;
      } catch (err) {
        console.warn('API updateQuantity failed:', err.message);
      }
    }

    const updated = items
      .map((it) => {
        if (it.cart_item_id === cartItemId) {
          const q = Math.max(1, quantity);
          return {
            ...it,
            quantity: q,
            item_total: (parseFloat(it.effective_price || it.price || 0) * q).toFixed(2),
          };
        }
        return it;
      });
    saveGuestCart(updated);
  };

  const removeItem = async (cartItemId) => {
    if (user && !cartItemId.toString().startsWith('guest-')) {
      try {
        await cartApi.removeItem(cartItemId);
        await fetchCart();
        return;
      } catch (err) {
        console.warn('API removeItem failed:', err.message);
      }
    }

    const updated = items.filter((it) => it.cart_item_id !== cartItemId);
    saveGuestCart(updated);
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.warn('API clearCart failed:', err.message);
      }
    }
    localStorage.removeItem(GUEST_CART_KEY);
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
