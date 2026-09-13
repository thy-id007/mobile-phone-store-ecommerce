import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const { items, subtotal, totalItems, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s ease',
        }}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--accent-blue)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Shopping Cart</h2>
            <span className="badge badge-blue">{totalItems}</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Your cart is empty</div>
              <p style={{ fontSize: '13px', marginBottom: '24px' }}>Looks like you haven't added any phones yet.</p>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/catalog');
                }}
                className="btn btn-primary btn-sm"
              >
                Browse Flagship Phones
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cart_item_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr auto',
                  gap: '14px',
                  padding: '12px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  alignItems: 'center',
                }}
              >
                <img
                  src={item.variant_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&auto=format&fit=crop&q=80'}
                  alt={item.product_name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', background: '#090d16' }}
                />

                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>
                    {item.product_name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {item.color_name} • {item.storage}
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                        style={{ background: 'none', border: 'none', color: '#fff', padding: '4px 8px', cursor: 'pointer' }}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: '700', padding: '0 6px' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: '#fff', padding: '4px 8px', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                  <button
                    onClick={() => removeItem(item.cart_item_id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>
                    ${(parseFloat(item.item_total || 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Shipping and taxes calculated at checkout.
            </div>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate('/checkout');
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '10px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
