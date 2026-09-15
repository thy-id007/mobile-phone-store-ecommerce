import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Eye, SlidersHorizontal, Check, Star, ShoppingCart } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { isComparing, toggleCompare } = useCompare();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [addedAnim, setAddedAnim] = useState(false);
  const comparing = isComparing(product.id);

  const discount = parseFloat(product.discount_percentage || 0);
  const basePrice = parseFloat(product.base_price);
  const discountedPrice = discount > 0 ? (basePrice * (1 - discount / 100)).toFixed(2) : basePrice.toFixed(2);

  const defaultImage = product.primary_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80';

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const defaultVariant = product.variants?.[0] || { id: product.id, color_name: 'Standard', storage: '256GB', ram: '8GB' };
      await addToCart(defaultVariant.id, 1, {
        product_name: product.name,
        product_slug: product.slug,
        variant_image: defaultImage,
        color_name: defaultVariant.color_name || 'Standard',
        storage: defaultVariant.storage || '256GB',
        ram: defaultVariant.ram || '8GB',
        effective_price: discountedPrice,
      });
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 2000);
    } catch (err) {
      console.error('Quick add failed:', err);
    }
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: '16px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
        e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top badges: Brand & Discount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span className="badge badge-blue">
          {product.brand_name || 'Brand'}
        </span>
        {discount > 0 && (
          <span className="badge badge-red">
            -{Math.round(discount)}% OFF
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        style={{
          display: 'block',
          height: '200px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md)',
          background: '#090d16',
          position: 'relative',
          marginBottom: '16px',
        }}
      >
        <img
          src={defaultImage}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80';
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
      </Link>

      {/* Product Title */}
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.4',
            marginBottom: '6px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-blue)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
        >
          {product.name}
        </h3>
      </Link>

      {/* Rating & Review Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24' }}>
          <Star size={14} fill="#fbbf24" stroke="none" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>
            {product.avg_rating || '5.0'}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          ({product.review_count || 12})
        </span>
      </div>

      {/* Quick Specs Snippet */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        {product.processor_spec && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Cpu size={13} color="var(--accent-cyan)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.processor_spec}
            </span>
          </div>
        )}
        {product.display_spec && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📱 {product.display_spec}
          </div>
        )}
      </div>

      {/* Pricing & CTA Controls */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
            ${discountedPrice}
          </span>
          {discount > 0 && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ${basePrice.toFixed(2)}
            </span>
          )}
          <span
            style={{
              fontSize: '11px',
              color: 'var(--accent-cyan)',
              fontWeight: '700',
              marginLeft: 'auto',
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              letterSpacing: '0.2px',
            }}
          >
            ≈ ៛{(Math.round(parseFloat(discountedPrice) * 4100 / 1000) * 1000).toLocaleString()} KHR
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '8px' }}>
          {/* Compare Toggle Button */}
          <button
            onClick={() => toggleCompare(product)}
            className={`btn ${comparing ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ padding: '8px 10px' }}
            title={comparing ? 'Remove from Comparison' : t('compare')}
          >
            {comparing ? <Check size={16} /> : <SlidersHorizontal size={16} />}
          </button>

          {/* View Details Link */}
          <Link to={`/product/${product.slug}`} className="btn btn-secondary btn-sm" style={{ width: '100%', gap: '6px' }}>
            <Eye size={15} />
            <span>{t('view_details')}</span>
          </Link>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className={`btn ${addedAnim ? 'btn-primary' : 'btn-primary'} btn-sm`}
            style={{
              padding: '8px 10px',
              background: addedAnim ? 'var(--success)' : 'var(--accent-gradient)',
              borderColor: addedAnim ? 'var(--success)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
            title={t('add_to_cart')}
          >
            {addedAnim ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
