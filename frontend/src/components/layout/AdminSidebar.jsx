import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  Users,
  ExternalLink,
  LogOut,
  Shield,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/admin/products', icon: Smartphone, label: 'Manage Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Manage Orders' },
    { to: '/admin/customers', icon: Users, label: 'Customer Accounts' },
  ];

  return (
    <aside
      className={`admin-sidebar ${isOpen ? 'open' : ''}`}
      style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '24px 16px',
      }}
    >
      {/* Admin Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px 24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>ADMIN PORTAL</div>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>STORE CONTROL HUB</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="admin-sidebar-close-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              fontSize: '14px',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            })}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Navigation */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={16} />
          <span>Customer Storefront</span>
        </Link>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: '13px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={16} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
