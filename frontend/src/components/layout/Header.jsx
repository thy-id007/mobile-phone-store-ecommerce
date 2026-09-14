import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, setIsDrawerOpen } = useCart();
  const { selectedPhones } = useCompare();
  const { language, toggleLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="glass-header">
      {/* Phnom Penh Local Shop Announcement Top Bar */}
      <div style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.18) 0%, rgba(6,182,212,0.18) 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '5px 0', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🇰🇭</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>Phnom Penh Local Flagship Store</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span>Preah Monivong & Toul Kork Branches</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>⚡ 1-2H Fast Delivery</span>
            <span>•</span>
            <span>🛡️ Official Cambodia Warranty</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>KHQR Instant Pay</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '20px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--accent-glow)'
          }}>
            <Smartphone size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS
            </span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginLeft: '4px' }}>
              PHONES
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', gap: '24px', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            {t('home')}
          </Link>
          <Link to="/catalog" style={{ fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            {t('all_phones')}
          </Link>
          <Link to="/compare" style={{ fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            {t('compare')}
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '380px', position: 'relative' }} className="desktop-search">
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px', height: '42px', borderRadius: 'var(--radius-full)' }}
          />
        </form>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Language Switcher Button (EN / ខ្មែរ) */}
          <button
            onClick={toggleLanguage}
            className="btn btn-outline btn-sm"
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)'
            }}
            title="Switch Language / ប្តូរភាសា"
          >
            <Globe size={14} color="var(--accent-cyan)" />
            <span>{language === 'en' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
          </button>

          {/* Compare Badge Icon */}
          <Link
            to="/compare"
            className="btn btn-outline"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', position: 'relative' }}
            title={t('compare')}
          >
            <SlidersHorizontal size={18} />
            <span style={{ fontSize: '13px', display: 'none' }} className="desktop-text">{t('compare')}</span>
            {selectedPhones.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-cyan)',
                color: '#000',
                fontSize: '11px',
                fontWeight: '800',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedPhones.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="btn btn-primary"
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', position: 'relative' }}
            title={t('cart')}
          >
            <ShoppingCart size={18} />
            <span style={{ fontSize: '13px', display: 'none' }} className="desktop-text">{t('cart')}</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '800',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-primary)'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Admin Status */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAdmin && (
                <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" title={t('admin_panel')}>
                  <LayoutDashboard size={16} />
                  <span className="desktop-text">Admin</span>
                </Link>
              )}
              <Link to="/profile" className="btn btn-outline btn-sm" title={t('my_profile')}>
                <User size={16} />
                <span className="desktop-text">{user.full_name?.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="btn btn-outline btn-sm" title={t('logout')} style={{ padding: '8px' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                {t('login')}
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                {t('register')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline mobile-toggle"
            style={{ padding: '8px', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '8px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '42px', height: '40px' }}
            />
          </form>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>{t('home')}</Link>
          <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>{t('all_phones')}</Link>
          <Link to="/compare" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>{t('compare')} ({selectedPhones.length})</Link>
          <button onClick={toggleLanguage} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
            <Globe size={16} />
            <span>{language === 'en' ? '🇰🇭 ភាសាខ្មែរ (Khmer)' : '🇬🇧 English'}</span>
          </button>
          {user && (
            <>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>{t('my_orders')}</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>{t('my_profile')}</Link>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600', color: 'var(--accent-cyan)' }}>
                  {t('admin_panel')}
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
