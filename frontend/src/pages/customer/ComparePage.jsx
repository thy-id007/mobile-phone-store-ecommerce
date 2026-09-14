import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Plus, X, ShoppingCart, Trash2, Cpu, Smartphone, Camera, BatteryCharging } from 'lucide-react';
import { productApi } from '../../services/api';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const ComparePage = () => {
  const { t } = useLanguage();
  const { selectedPhones, removeFromCompare, clearCompare, toggleCompare } = useCompare();
  const { addToCart } = useCart();
  const [comparisonData, setComparisonData] = useState([]);
  const [availablePhones, setAvailablePhones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch detailed comparison for selected phones
  useEffect(() => {
    const fetchComparison = async () => {
      if (selectedPhones.length < 2) {
        setComparisonData([]);
        return;
      }
      try {
        setLoading(true);
        const ids = selectedPhones.map((p) => p.id).join(',');
        const res = await productApi.compareProducts(ids);
        if (res.success) {
          setComparisonData(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load comparison data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [selectedPhones]);

  // Fetch catalog to allow adding more phones into slots
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await productApi.getProducts({ limit: 50 });
        if (res.success) {
          setAvailablePhones(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load catalog for comparison picker:', err.message);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
            <SlidersHorizontal size={16} />
            <span>{t('compare', 'HARDWARE MATRIX')}</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>{t('comparison_title', 'Side-by-Side Mobile Phone Comparison')}</h1>
        </div>

        {selectedPhones.length > 0 && (
          <button onClick={clearCompare} className="btn btn-outline btn-sm">
            <Trash2 size={14} />
            <span>{t('clear_filters', 'Clear Matrix')}</span>
          </button>
        )}
      </div>

      {selectedPhones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <SlidersHorizontal size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{t('compare_up_to', 'No phones selected for comparison')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            {t('compare_up_to', 'Browse our flagship collection and select between 2 and 4 smartphones to compare hardware specifications side-by-side.')}
          </p>
          <Link to="/catalog" className="btn btn-primary">
            {t('browse_smartphones', 'Explore All Smartphones')}
          </Link>
        </div>
      ) : selectedPhones.length === 1 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Select at least one more phone to compare</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            You have selected <strong>{selectedPhones[0].name}</strong>. Add another phone to initiate the comparison engine.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link to="/catalog" className="btn btn-primary">
              Choose Phone from Catalog
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Aligning hardware specification matrix...
        </div>
      ) : (
        <div>
          <div className="mobile-scroll-hint" style={{ display: 'none', textAlign: 'right', fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
            👈 Swipe horizontally to compare →
          </div>
          <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <tbody>
                
                {/* ROW 1: HEADER & REMOVE BUTTONS */}
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '16px 20px', width: '180px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Smartphones ({comparisonData.length}/4)
                  </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '20px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                      <button
                        onClick={() => removeFromCompare(phone.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        title="Remove phone"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <img
                      src={phone.primary_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80'}
                      alt={phone.name}
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', background: '#090d16', marginBottom: '12px' }}
                    />
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                      {phone.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                      {phone.brand_name}
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 2: PRICE & CTAs */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Starting Price
                </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
                      ${parseFloat(phone.base_price).toFixed(2)}
                    </div>
                    <Link to={`/product/${phone.slug}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>

              {/* ROW 3: PROCESSOR */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Processor / Chipset
                </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Cpu size={16} color="var(--accent-cyan)" />
                      <span>{phone.processor_spec || 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 4: DISPLAY */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Display Screen
                </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Smartphone size={16} color="var(--accent-blue)" />
                      <span>{phone.display_spec || 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 5: CAMERA */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Camera System
                </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Camera size={16} color="var(--warning)" />
                      <span>{phone.camera_spec || 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 6: BATTERY & CHARGING */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Battery & Power
                </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BatteryCharging size={16} color="var(--success)" />
                      <span>{phone.battery_spec || 'N/A'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* ROW 7: OPERATING SYSTEM */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Operating System
                </th>
                {comparisonData.map((phone) => (
                  <td key={phone.id} style={{ padding: '16px 20px', fontSize: '14px', color: '#fff', fontWeight: '500' }}>
                    {phone.os_spec || 'N/A'}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    )}

      {/* Quick Add Selector Bar */}
      {selectedPhones.length > 0 && selectedPhones.length < 4 && (
        <div style={{ marginTop: '30px', padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
            <Plus size={18} color="var(--accent-blue)" />
            <span>Add another phone to compare:</span>
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) {
                const target = availablePhones.find((p) => p.id === e.target.value);
                if (target) toggleCompare(target);
                e.target.value = '';
              }
            }}
            className="select-field"
            style={{ maxWidth: '300px' }}
            defaultValue=""
          >
            <option value="" disabled>Select a phone...</option>
            {availablePhones
              .filter((p) => !selectedPhones.some((s) => s.id === p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.base_price})
                </option>
              ))}
          </select>
        </div>
      )}

    </div>
  );
};

export default ComparePage;
