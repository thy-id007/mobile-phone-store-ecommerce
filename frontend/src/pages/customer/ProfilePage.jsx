import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, Package, ShoppingBag, Save, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authApi.updateProfile({ full_name: fullName, phone });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Please login to view your profile</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Account Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your contact details and default shipping information</p>
        </div>
        <button onClick={logout} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Quick Links Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', color: '#fff' }}>
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '16px' }}>{user.full_name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/orders" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}>
              <Package size={16} color="var(--accent-blue)" />
              <span>Track Orders & Receipts</span>
            </Link>
            <Link to="/cart" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}>
              <ShoppingBag size={16} color="var(--accent-cyan)" />
              <span>View Shopping Cart</span>
            </Link>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Edit Personal Info</h2>

          {savedSuccess && (
            <div style={{ padding: '10px 14px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>
              ✓ Profile saved successfully
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Read Only)</label>
              <input
                type="text"
                disabled
                value={user.email}
                className="input-field"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Contact</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ gap: '8px', alignSelf: 'flex-start' }}>
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
