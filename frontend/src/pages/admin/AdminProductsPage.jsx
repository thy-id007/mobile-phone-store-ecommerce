import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Smartphone, X, Search, Check } from 'lucide-react';
import { adminApi, productApi } from '../../services/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Phone Form State
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    brand_id: '',
    category_id: '',
    base_price: '',
    discount_percentage: 0,
    display_spec: '',
    processor_spec: '',
    camera_spec: '',
    battery_spec: '',
    os_spec: 'Android 14',
    is_featured: false,
    color_name: 'Titanium Black',
    color_hex: '#1e1e1e',
    storage: '256GB',
    ram: '12GB',
    stock_quantity: 25,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, bRes, cRes] = await Promise.all([
        productApi.getProducts({ limit: 50 }),
        productApi.getBrands(),
        productApi.getCategories(),
      ]);

      if (pRes.success) setProducts(pRes.data || []);
      if (bRes.success) {
        setBrands(bRes.data || []);
        if (bRes.data?.length > 0) setFormData((prev) => ({ ...prev, brand_id: bRes.data[0].id }));
      }
      if (cRes.success) {
        setCategories(cRes.data || []);
        if (cRes.data?.length > 0) setFormData((prev) => ({ ...prev, category_id: cRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load products list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) return;
    try {
      await adminApi.deleteProduct(productId);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.base_price) {
      alert('Please fill out required product name and base price.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        model: formData.model || formData.name,
        brand_id: formData.brand_id,
        category_id: formData.category_id,
        base_price: parseFloat(formData.base_price),
        discount_percentage: parseFloat(formData.discount_percentage || 0),
        display_spec: formData.display_spec,
        processor_spec: formData.processor_spec,
        camera_spec: formData.camera_spec,
        battery_spec: formData.battery_spec,
        os_spec: formData.os_spec,
        is_featured: formData.is_featured,
        variants: [
          {
            color_name: formData.color_name,
            color_hex: formData.color_hex,
            storage: formData.storage,
            ram: formData.ram,
            price: parseFloat(formData.base_price),
            stock_quantity: parseInt(formData.stock_quantity, 10),
          },
        ],
        specifications: [
          { spec_group: 'Display', spec_name: 'Panel & Refresh', spec_value: formData.display_spec || 'OLED 120Hz' },
          { spec_group: 'Performance', spec_name: 'Processor', spec_value: formData.processor_spec || 'Octa-core 4nm' },
          { spec_group: 'Battery', spec_name: 'Capacity', spec_value: formData.battery_spec || '5000 mAh' },
        ],
      };

      const res = await adminApi.createProduct(payload);
      if (res.success) {
        setShowModal(false);
        await loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-content-padding">
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Product Catalog Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Add new smartphone models, configure specs, and adjust variant stocks</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={18} />
          <span>Add New Smartphone</span>
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 16px' }}>SMARTPHONE</th>
                <th style={{ padding: '14px 16px' }}>BRAND</th>
                <th style={{ padding: '14px 16px' }}>CATEGORY</th>
                <th style={{ padding: '14px 16px' }}>BASE PRICE</th>
                <th style={{ padding: '14px 16px' }}>VARIANTS</th>
                <th style={{ padding: '14px 16px' }}>STATUS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading smartphone inventory...
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={p.primary_image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=120&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', background: '#090d16' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.processor_spec}</div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                    {p.brand_name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {p.category_name}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '800' }}>
                    ${parseFloat(p.base_price).toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                    {p.variants?.length || 1} SKUs
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-green">{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}
                      title="Delete phone"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PHONE MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800' }}>
                <Smartphone size={20} color="var(--accent-blue)" />
                <span>Add New Smartphone Model</span>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony Xperia 1 VI"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Brand Manufacturer *</label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                    className="select-field"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="select-field"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="999.00"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Hardware Specifications */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                  HARDWARE HIGHLIGHTS
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Processor Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. Snapdragon 8 Gen 3"
                      value={formData.processor_spec}
                      onChange={(e) => setFormData({ ...formData, processor_spec: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.7-inch OLED 120Hz"
                      value={formData.display_spec}
                      onChange={(e) => setFormData({ ...formData, display_spec: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Camera Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. 50MP + 48MP Zoom"
                      value={formData.camera_spec}
                      onChange={(e) => setFormData({ ...formData, camera_spec: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Battery Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. 5000 mAh 65W Fast"
                      value={formData.battery_spec}
                      onChange={(e) => setFormData({ ...formData, battery_spec: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Variant */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '12px' }}>
                  INITIAL STOCK VARIANT
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Color Name</label>
                    <input
                      type="text"
                      value={formData.color_name}
                      onChange={(e) => setFormData({ ...formData, color_name: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Storage Capacity</label>
                    <input
                      type="text"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Stock Qty</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Creating...' : 'Save Smartphone'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;
