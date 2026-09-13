import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const CompareFloatingBar = () => {
  const { selectedPhones, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on compare page itself
  if (selectedPhones.length === 0 || location.pathname === '/compare') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        borderRadius: 'var(--radius-full)',
        padding: '8px 16px 8px 24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '90vw',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SlidersHorizontal size={18} color="var(--accent-cyan)" />
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
          Compare ({selectedPhones.length}/4):
        </span>
      </div>

      {/* Selected Phone Thumbnails */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {selectedPhones.map((phone) => (
          <div
            key={phone.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-card)',
              padding: '4px 8px 4px 4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <img
              src={phone.primary_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=80&auto=format&fit=crop&q=80'}
              alt={phone.name}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '12px', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {phone.model || phone.name}
            </span>
            <button
              onClick={() => removeFromCompare(phone.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/compare')}
          className="btn btn-primary btn-sm"
          style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
        >
          <span>Compare Now</span>
          <ArrowRight size={14} />
        </button>
        <button
          onClick={clearCompare}
          className="btn btn-outline btn-sm"
          style={{ borderRadius: 'var(--radius-full)', padding: '6px 10px', fontSize: '11px' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default CompareFloatingBar;
