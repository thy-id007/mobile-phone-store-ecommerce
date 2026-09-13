import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Eye, SlidersHorizontal, Check, Star } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const ProductCard = ({ product }) => {
  const { isComparing, toggleCompare } = useCompare();
  const comparing = isComparing(product.id);

  const discount = parseFloat(product.discount_percentage || 0);
  const basePrice = parseFloat(product.base_price);
  const discountedPrice = discount > 0 ? (basePrice * (1 - discount / 100)).toFixed(2) : basePrice.toFixed(2);

  const defaultImage = product.primary_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80';

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
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Phone Name & Rating */}
      <div style={{ marginBottom: '8px' }}>
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '6px',
              color: '#fff',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
            <Star size={13} fill="#f59e0b" />
            <span style={{ fontWeight: '700' }}>{product.avg_rating || '5.0'}</span>
          </div>
          <span>•</span>
          <span>{product.review_count || 0} reviews</span>
        </div>
      </div>

      {/* Hardware Specs Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '16px', flex: 1 }}>
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
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
            ${discountedPrice}
          </span>
          {discount > 0 && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ${basePrice.toFixed(2)}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px' }}>
          {/* Compare Toggle Button */}
          <button
            onClick={() => toggleCompare(product)}
            className={`btn ${comparing ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ padding: '8px 10px' }}
            title={comparing ? 'Remove from Comparison' : 'Add to Compare'}
          >
            {comparing ? <Check size={16} /> : <SlidersHorizontal size={16} />}
          </button>

          {/* View Details Link */}
          <Link to={`/product/${product.slug}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            <Eye size={15} />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
