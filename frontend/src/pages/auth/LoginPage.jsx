import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCustomerCredentials = () => {
    setEmail('customer@example.com');
    setPassword('password123');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@mobilestore.com');
    setPassword('admin123');
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '440px' }}>
      
      <div className="card card-auth" style={{ padding: '38px 32px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 24px var(--accent-glow)' }}>
            <Smartphone size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to manage your orders, wishlist, and profile</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: '#fca5a5', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '42px' }}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--accent-cyan)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              marginTop: '10px',
              gap: '8px',
              fontWeight: '700',
              letterSpacing: '0.02em',
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Academic Demo Credentials Shortcuts */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '28px', paddingTop: '22px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Demo Preset Accounts (University Evaluation)
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={fillCustomerCredentials}
              className="btn btn-sm"
              style={{
                flex: 1,
                fontSize: '12px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93c5fd',
                padding: '10px 12px',
                fontWeight: '600',
              }}
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="btn btn-sm"
              style={{
                flex: 1,
                fontSize: '12px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#67e8f9',
                padding: '10px 12px',
                fontWeight: '600',
              }}
            >
              ⚡ Admin Portal
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
            Create Account
          </Link>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;
