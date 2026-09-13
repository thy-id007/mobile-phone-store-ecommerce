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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, setIsDrawerOpen } = useCart();
  const { selectedPhones } = useCompare();
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '24px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
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
        <nav style={{ display: 'none', gap: '28px', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            Home
          </Link>
          <Link to="/catalog" style={{ fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            All Phones
          </Link>
          <Link to="/compare" style={{ fontWeight: '500', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
            Compare
          </Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px', position: 'relative' }} className="desktop-search">
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search phones, brands, chipsets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '42px', height: '42px', borderRadius: 'var(--radius-full)' }}
          />
        </form>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Compare Badge Icon */}
          <Link
            to="/compare"
            className="btn btn-outline"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-full)', position: 'relative' }}
            title="Phone Comparison"
          >
            <SlidersHorizontal size={18} />
            <span style={{ fontSize: '13px', display: 'none' }} className="desktop-text">Compare</span>
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
          >
            <ShoppingCart size={18} />
            <span style={{ fontSize: '13px', display: 'none' }} className="desktop-text">Cart</span>
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
                <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" title="Admin Portal">
                  <LayoutDashboard size={16} />
                  <span className="desktop-text">Admin</span>
                </Link>
              )}
              <Link to="/profile" className="btn btn-outline btn-sm" title="Profile & Orders">
                <User size={16} />
                <span className="desktop-text">{user.full_name?.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="btn btn-outline btn-sm" title="Logout" style={{ padding: '8px' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
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
              placeholder="Search phones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '42px', height: '40px' }}
            />
          </form>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>Home</Link>
          <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>All Phones</Link>
          <Link to="/compare" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>Compare Phones ({selectedPhones.length})</Link>
          {user && (
            <>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>Order History</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600' }}>My Account</Link>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', fontWeight: '600', color: 'var(--accent-cyan)' }}>
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      )}

      {/* CSS helper for responsive desktop elements */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-text { display: inline !important; }
        }
        @media (max-width: 859px) {
          .desktop-search { display: none !important; }
          .mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
