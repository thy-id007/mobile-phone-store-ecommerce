import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const CartPage = () => {
  const { t } = useLanguage();
  const { items, subtotal, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <ShoppingBag size={56} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.4 }} />
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '10px' }}>{t('cart_empty', 'Your Shopping Cart is Empty')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '28px' }}>
          {t('cart_empty_desc', 'Explore our latest flagship collection with titanium builds and optical zoom.')}
        </p>
        <Link to="/catalog" className="btn btn-primary btn-lg">
          {t('browse_smartphones', 'Browse All Smartphones')}
        </Link>
      </div>
    );
  }

  const shippingFee = subtotal >= 500 ? 0 : 25;
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>{t('shopping_cart', 'Shopping Cart')} ({totalItems})</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Review your chosen phone configurations before checkout</p>
        </div>
        <button onClick={clearCart} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
          <Trash2 size={14} />
          <span>{t('clear_cart', 'Clear Cart')}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'start' }}>
        
        {/* Cart Items Table/Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => (
            <div
              key={item.cart_item_id}
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto',
                gap: '20px',
                alignItems: 'center',
                padding: '16px',
              }}
            >
              <img
                src={item.variant_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80'}
                alt={item.product_name}
                style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px', background: '#090d16' }}
              />

              <div>
                <Link to={`/product/${item.product_slug}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                    {item.product_name}
                  </h3>
                </Link>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {t('color', 'Color')}: {item.color_name} • {t('storage', 'Storage')}: {item.storage} • {t('ram', 'RAM')}: {item.ram}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1))}
                      style={{ padding: '6px 10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: '700', padding: '0 8px' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                      style={{ padding: '6px 10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    @ ${parseFloat(item.effective_price).toFixed(2)} each
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                <button
                  onClick={() => removeItem(item.cart_item_id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                  ${(parseFloat(item.item_total)).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>{t('total', 'Order Total')}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>{t('subtotal', 'Items Subtotal')}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>{t('shipping', 'Estimated Delivery')}</span>
              <span>{shippingFee === 0 ? <span className="badge badge-green">{t('free', 'FREE')}</span> : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', color: '#fff', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <span>{t('total', 'Total Cost')}</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '10px' }}
          >
            <span>{t('checkout', 'Proceed to Checkout')}</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
            <ShieldCheck size={14} color="var(--success)" />
            <span>2-Year Official Manufacturer Warranty included</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
