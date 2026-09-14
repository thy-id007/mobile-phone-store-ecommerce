import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Tag, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { orderApi } from '../../services/api';
import PaymentQrModal from '../../components/common/PaymentQrModal';

const CheckoutPage = () => {
  const { t } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    recipient_name: user?.full_name || '',
    phone: user?.phone || '',
    street_address: '',
    city: 'Phnom Penh',
    state_province: 'Phnom Penh',
    postal_code: '12000',
    country: 'Cambodia',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showQrModal, setShowQrModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const handleSelectPaymentMethod = (methodId) => {
    setPaymentMethod(methodId);
    if (methodId === 'Bank Transfer') {
      setShowQrModal(true);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your shopping cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>Add at least one smartphone to proceed with checkout.</p>
        <Link to="/catalog" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  // Calculate discounts & shipping
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingFee = subtotal >= 500 ? 0 : 25;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', type: 'percentage', value: 10 });
      alert('10% discount applied to your order!');
    } else if (code === 'SAVE50') {
      if (subtotal >= 1000) {
        setAppliedCoupon({ code: 'SAVE50', type: 'fixed', value: 50 });
        alert('$50 discount applied!');
      } else {
        alert('Coupon SAVE50 requires a minimum order of $1000.');
      }
    } else {
      alert('Invalid or expired promotional code.');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.recipient_name || !shippingAddress.phone || !shippingAddress.street_address) {
      alert('Please fill out all required shipping address fields.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        notes: notes || undefined,
      };

      const res = await orderApi.checkout(payload);
      if (res.success) {
        await clearCart();
        setOrderComplete(res.data);
      }
    } catch (err) {
      alert(err.message || 'Checkout failed. Please check stock availability.');
    } finally {
      setSubmitting(false);
    }
  };

  // Order Complete Screen
  if (orderComplete) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-card)', padding: '50px 40px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--success)' }}>
            <CheckCircle2 size={36} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '12px' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
            Thank you for your smartphone purchase. We have received your order and our logistics team is preparing your package.
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>{orderComplete.order_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <span style={{ fontWeight: '600', color: '#fff' }}>{paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Settled:</span>
              <span style={{ fontWeight: '800', color: 'var(--success)', fontSize: '18px' }}>${parseFloat(orderComplete.total_amount).toFixed(2)}</span>
            </div>
          </div>

          {paymentMethod === 'Bank Transfer' && (
            <div
              style={{
                background: 'rgba(225, 29, 72, 0.08)',
                border: '1px solid rgba(225, 29, 72, 0.35)',
                borderRadius: '14px',
                padding: '18px',
                marginBottom: '28px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: '800', color: '#f43f5e', fontSize: '15px', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <QrCode size={20} />
                <span>Bank Transfer (KHQR) Payment Required</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', marginBottom: '14px' }}>
                Please scan the QR code to complete transfer of <strong>${parseFloat(orderComplete.total_amount).toFixed(2)} USD</strong> to ABA Bank (001 889 992).
              </p>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '0 auto', padding: '8px 18px' }}
              >
                <QrCode size={16} />
                <span>View / Scan QR Code Again</span>
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to={`/orders`} className="btn btn-primary">
              View Order History
            </Link>
            <Link to="/catalog" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>

        <PaymentQrModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          totalAmount={parseFloat(orderComplete.total_amount)}
          orderNumber={orderComplete.order_number || ''}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>
        {t('checkout', 'Checkout & Shipping Confirmation')}
      </h1>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* LEFT: Address & Payment Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Shipping Address Box */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--accent-blue)" />
              <span>1. {t('shipping_address', 'Delivery Address')}</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.recipient_name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, recipient_name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Alex Johnson"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact (KH) *</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="input-field"
                  placeholder="012 888 992 or +855 12 888 992"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address / House No. *</label>
              <input
                type="text"
                required
                value={shippingAddress.street_address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street_address: e.target.value })}
                className="input-field"
                placeholder="e.g. St 271, Sangkat Toul Tompoung / Monivong Blvd"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">City / Province</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="input-field"
                  placeholder="Phnom Penh"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Khan / District</label>
                <input
                  type="text"
                  value={shippingAddress.state_province}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state_province: e.target.value })}
                  className="input-field"
                  placeholder="Khan Chamkarmon"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="input-field"
                  placeholder="Cambodia"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="var(--accent-blue)" />
              <span>2. {t('payment_method', 'Payment Option')}</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'COD', title: t('cash_on_delivery', 'Cash on Delivery (COD)'), desc: 'Pay with cash upon package receipt' },
                { id: 'Bank Transfer', title: t('bank_transfer', 'Direct Bank Wire Transfer (QR Code)'), desc: 'Electronic bank transfer with instant verification' },
                { id: 'Credit Card', title: 'Credit / Debit Card (Visa/Mastercard)', desc: 'Encrypted payment gateway' },
                { id: 'E-Wallet', title: 'E-Wallet / Apple Pay / Google Pay', desc: 'One-touch mobile checkout' },
              ].map((m) => (
                <div
                  key={m.id}
                  id={`payment-method-${m.id.toLowerCase().replace(/\s+/g, '-')}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectPaymentMethod(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectPaymentMethod(m.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: paymentMethod === m.id ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-input)',
                    border: paymentMethod === m.id ? '2px solid var(--accent-blue)' : '1px solid var(--border-card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <input
                    type="radio"
                    id={`radio-${m.id.toLowerCase().replace(/\s+/g, '-')}`}
                    name="payment_method"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => handleSelectPaymentMethod(m.id)}
                    style={{ accentColor: 'var(--accent-blue)', marginTop: '4px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{m.title}</span>
                      {m.id === 'Bank Transfer' && (
                        <span
                          style={{
                            background: 'linear-gradient(135deg, #e11d48, #be123c)',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '900',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 5px rgba(225, 29, 72, 0.4)',
                          }}
                        >
                          KHQR
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{m.desc}</div>

                    {m.id === 'Bank Transfer' && paymentMethod === 'Bank Transfer' && (
                      <div
                        style={{
                          marginTop: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                          background: 'rgba(59, 130, 246, 0.08)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowQrModal(true);
                          }}
                          className="btn btn-sm btn-primary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            fontWeight: '700',
                          }}
                        >
                          <QrCode size={15} />
                          <span>{t('qr_view_button', 'Scan QR Code Now')}</span>
                        </button>
                        <span style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>
                          ABA Bank • Bakong KHQR
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Special Instructions */}
          <div className="card">
            <label className="form-label">Delivery Notes / Specific Gate Instructions (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea-field"
              placeholder="e.g. Please ring doorbell twice, leave at reception desk..."
            />
          </div>

        </div>

        {/* RIGHT: Order Summary & Coupon */}
        <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>{t('total', 'Order Overview')}</h2>

            {/* Selected items snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', maxHeight: '240px', overflowY: 'auto' }}>
              {items.map((it) => (
                <div key={it.cart_item_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#fff' }}>{it.product_name}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>x{it.quantity}</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{it.color_name} • {it.storage}</div>
                  </div>
                  <div style={{ fontWeight: '700' }}>${parseFloat(it.item_total).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder={t('coupon_code', 'Coupon (e.g. WELCOME10)')}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="input-field"
                  style={{ textTransform: 'uppercase', fontSize: '13px' }}
                />
                <button type="button" onClick={handleApplyCoupon} className="btn btn-secondary btn-sm">
                  {t('apply_coupon', 'Apply')}
                </button>
              </div>
              {appliedCoupon && (
                <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '6px', fontWeight: '600' }}>
                  ✓ Coupon "{appliedCoupon.code}" activated
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('subtotal', 'Subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                  <span>{t('coupon_code', 'Promotional Discount')}</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('shipping', 'Express Insured Shipping')}</span>
                <span>{shippingFee === 0 ? <span className="badge badge-green">{t('free', 'FREE')}</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
                <span>{t('total', 'Total Due')}</span>
                <span style={{ color: '#fff' }}>${totalAmount.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', fontSize: '13px', color: 'var(--accent-cyan)' }}>
                <span>KHR Equivalent:</span>
                <span style={{ fontWeight: '700' }}>≈ ៛{(Math.round(totalAmount * 4100 / 1000) * 1000).toLocaleString()} KHR</span>
              </div>

              <div style={{ marginTop: '8px', padding: '8px 10px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                🇰🇭 <strong>Phnom Penh Express:</strong> 1-2H delivery via Grab/Nham24 or pick up at Toul Kork / BKK1 branches.
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '24px', gap: '10px' }}
            >
              <span>{submitting ? '...' : t('place_order', 'Confirm & Place Order')}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
              <ShieldCheck size={14} color="var(--success)" />
              <span>Transactional inventory hold guaranteed</span>
            </div>
          </div>

        </div>

      </form>

      {/* Bank Transfer / KHQR Payment Modal */}
      <PaymentQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        totalAmount={totalAmount}
        orderNumber={orderComplete?.order_number || ''}
      />

    </div>
  );
};

export default CheckoutPage;
