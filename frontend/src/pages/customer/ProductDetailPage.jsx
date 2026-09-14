import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  SlidersHorizontal,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Cpu,
  Smartphone,
  Camera,
  BatteryCharging,
  Layers,
} from 'lucide-react';
import { productApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductDetailPage = () => {
  const { t } = useLanguage();
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isComparing, toggleCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productApi.getProduct(slug);
        if (res.success && res.data) {
          const p = res.data;
          setProduct(p);
          // Set default variant
          const defaultVar = (p.variants && p.variants.find((v) => v.is_default)) || (p.variants && p.variants[0]) || null;
          setSelectedVariant(defaultVar);
          // Set active image
          const primaryImg = (p.images && p.images[0]?.image_url) || defaultVar?.variant_image || '';
          setActiveImage(primaryImg);
        }
      } catch (err) {
        console.error('Failed to load phone:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading phone specifications & variants...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>The phone you are looking for does not exist or has been discontinued.</p>
        <Link to="/catalog" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  const discount = parseFloat(product.discount_percentage || 0);
  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(product.base_price);
  const effectivePrice = discount > 0 ? (currentPrice * (1 - discount / 100)).toFixed(2) : currentPrice.toFixed(2);
  const comparing = isComparing(product.id);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      setAddingToCart(true);
      await addToCart(selectedVariant.id, quantity);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Please log in to add items to your cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Group specifications by group category
  const specsByGroup = {};
  if (product.specifications) {
    for (const spec of product.specifications) {
      if (!specsByGroup[spec.spec_group]) specsByGroup[spec.spec_group] = [];
      specsByGroup[spec.spec_group].push(spec);
    }
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/catalog">Catalog</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start', marginBottom: '70px' }}>
        
        {/* Left: Gallery */}
        <div>
          <div
            style={{
              width: '100%',
              height: '420px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#090d16',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
            }}
          >
            <img
              src={activeImage || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: activeImage === img.image_url ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: '#090d16',
                    padding: 0,
                  }}
                >
                  <img
                    src={img.image_url}
                    alt="thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Phone Info & Variant Selector */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-blue">{product.brand_name}</span>
            <span className="badge badge-green">IN STOCK</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>
            {product.name}
          </h1>

          {/* Rating overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
              <Star size={16} fill="#f59e0b" />
              <span style={{ fontWeight: '700' }}>{product.avg_rating || '5.0'}</span>
            </div>
            <span>•</span>
            <span>{product.review_count || 0} customer ratings</span>
          </div>

          {/* Pricing Box */}
          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: '900', color: '#fff' }}>
                ${effectivePrice}
              </span>
              {discount > 0 && (
                <>
                  <span style={{ fontSize: '18px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="badge badge-red">SAVE {Math.round(discount)}%</span>
                </>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Includes local Cambodia import duties & official manufacturer warranty
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-subtle)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                🇰🇭 Cambodia Local Retail Price
              </span>
              <span style={{ fontSize: '15px', color: 'var(--accent-cyan)', fontWeight: '800' }}>
                ≈ ៛{(Math.round(parseFloat(effectivePrice) * 4100 / 1000) * 1000).toLocaleString()} KHR
              </span>
            </div>
          </div>

          {/* Variant Selector: Color */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('color', 'Color')}:</span>
                <span style={{ color: '#fff', fontWeight: '700' }}>{selectedVariant?.color_name}</span>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {Array.from(new Set(product.variants.map((v) => v.color_name))).map((colorName) => {
                  const vMatch = product.variants.find((v) => v.color_name === colorName);
                  const isSelected = selectedVariant?.color_name === colorName;
                  return (
                    <button
                      key={colorName}
                      onClick={() => {
                        const nextV = product.variants.find((v) => v.color_name === colorName && v.storage === selectedVariant?.storage) || vMatch;
                        setSelectedVariant(nextV);
                        if (nextV.variant_image) setActiveImage(nextV.variant_image);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                        border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-card)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px',
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: vMatch?.color_hex || '#333',
                          border: '1px solid rgba(255,255,255,0.4)',
                        }}
                      />
                      <span>{colorName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant Selector: Storage */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('storage', 'Storage')} & {t('ram', 'RAM')}:</span>
                <span style={{ color: '#fff', fontWeight: '700' }}>{selectedVariant?.storage} ({selectedVariant?.ram} RAM)</span>
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {Array.from(new Set(product.variants.map((v) => v.storage))).map((storageSize) => {
                  const vMatch = product.variants.find((v) => v.storage === storageSize && v.color_name === selectedVariant?.color_name) ||
                                 product.variants.find((v) => v.storage === storageSize);
                  const isSelected = selectedVariant?.storage === storageSize;
                  return (
                    <button
                      key={storageSize}
                      onClick={() => {
                        if (vMatch) setSelectedVariant(vMatch);
                      }}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                        border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-card)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}
                    >
                      {storageSize}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTAs */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px' }}>
            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '12px 16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontWeight: '700' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '12px 16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, gap: '10px' }}
              disabled={addingToCart}
            >
              <ShoppingCart size={20} />
              <span>{addingToCart ? '...' : cartSuccess ? '✓ ' + t('add_to_cart', 'Added') : t('add_to_cart', 'Add to Cart')}</span>
            </button>

            {/* Compare Toggle */}
            <button
              onClick={() => toggleCompare(product)}
              className={`btn ${comparing ? 'btn-primary' : 'btn-secondary'} btn-lg`}
              style={{ padding: '14px 16px' }}
              title={comparing ? 'Remove from Comparison' : 'Add to Compare'}
            >
              {comparing ? <Check size={20} /> : <SlidersHorizontal size={20} />}
            </button>
          </div>

          {/* Key Specs Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Cpu size={16} color="var(--accent-cyan)" />
              <span>{product.processor_spec || 'Flagship Processor'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Camera size={16} color="var(--accent-blue)" />
              <span>{product.camera_spec || 'Multi-lens Optical Camera'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <BatteryCharging size={16} color="var(--success)" />
              <span>{product.battery_spec || 'All-day Battery Life'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Smartphone size={16} color="var(--warning)" />
              <span>{product.os_spec || 'Latest Operating System'}</span>
            </div>
          </div>

          {/* Phnom Penh Local Shop Delivery & Official Cambodia Warranty Assurance */}
          <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: '700' }}>
              <span>🇰🇭</span>
              <span>Phnom Penh In-Stock • Local Shop Guarantee</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>⚡ 1-2H Fast Delivery via Grab / Nham24 in Phnom Penh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>🛡️ 1-Year Official Cambodia Warranty with local service center</span>
            </div>
          </div>

        </div>
      </div>

      {/* FULL TECHNICAL SPECIFICATIONS SHEET */}
      <section style={{ marginBottom: '70px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>
          {t('specs', 'Detailed Technical Specifications')}
        </h2>

        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          {Object.keys(specsByGroup).length === 0 ? (
            <div style={{ padding: '30px', color: 'var(--text-muted)' }}>
              Standard manufacturer specifications apply.
            </div>
          ) : (
            Object.entries(specsByGroup).map(([groupName, specsList], gIdx) => (
              <div key={groupName} style={{ borderBottom: gIdx < Object.keys(specsByGroup).length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', fontWeight: '700', fontSize: '15px', color: 'var(--accent-blue)' }}>
                  {groupName}
                </div>
                <div>
                  {specsList.map((s, idx) => (
                    <div
                      key={s.spec_name}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '220px 1fr',
                        padding: '14px 24px',
                        borderBottom: idx < specsList.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        fontSize: '14px',
                      }}
                    >
                      <div style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{s.spec_name}</div>
                      <div style={{ color: '#fff' }}>{s.spec_value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CUSTOMER REVIEWS & RATINGS */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
            {t('reviews', 'Verified Customer Reviews')} ({product.reviews?.length || 0})
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'var(--bg-card)',
                  padding: '20px 24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{rev.author_name}</div>
                  <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                  </div>
                </div>
                {rev.title && <div style={{ fontWeight: '600', marginBottom: '6px', color: 'var(--accent-cyan)' }}>{rev.title}</div>}
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>{rev.comment}</p>
              </div>
            ))
          ) : (
            <div style={{ padding: '30px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
              No reviews yet for this mobile phone. Be the first to review after purchasing!
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default ProductDetailPage;
