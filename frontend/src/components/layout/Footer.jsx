import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '80px' }}>
      
      {/* Service Highlights */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: '36px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.12)', padding: '12px', borderRadius: '12px', color: 'var(--accent-blue)' }}>
              <Truck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Free Express Delivery</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>On all flagship phone orders</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '12px', color: 'var(--success)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>2-Year Official Warranty</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>100% Genuine manufacturer stock</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.12)', padding: '12px', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>30-Day Easy Returns</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hassle-free replacement policy</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '12px', borderRadius: '12px', color: 'var(--warning)' }}>
              <Headphones size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>24/7 Tech Support</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Dedicated mobile phone specialists</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '60px 20px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '800', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS PHONES
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
            Next-generation smartphone store built for technology enthusiasts. Browse, compare, and order the world’s most advanced mobile devices.
          </p>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            University Capstone Full-Stack E-Commerce Project
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px', color: '#fff' }}>Shop Categories</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/catalog?category=flagship" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Flagship Tier</Link></li>
            <li><Link to="/catalog?category=foldables" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Foldable Devices</Link></li>
            <li><Link to="/catalog?category=gaming" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Gaming Phones</Link></li>
            <li><Link to="/catalog?category=mid-range" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Mid-Range Value</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px', color: '#fff' }}>Top Brands</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/catalog?brand=apple" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Apple iPhone</Link></li>
            <li><Link to="/catalog?brand=samsung" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Samsung Galaxy</Link></li>
            <li><Link to="/catalog?brand=google" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Google Pixel</Link></li>
            <li><Link to="/catalog?brand=oneplus" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>OnePlus</Link></li>
            <li><Link to="/catalog?brand=xiaomi" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Xiaomi</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px', color: '#fff' }}>Customer Portal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/profile" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>My Account</Link></li>
            <li><Link to="/orders" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track Orders</Link></li>
            <li><Link to="/compare" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Compare Matrix</Link></li>
            <li><Link to="/cart" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Shopping Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '18px', color: '#fff' }}>🇰🇭 Phnom Penh Stores</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>📍 <strong>BKK1 Branch:</strong> Preah Monivong Blvd, BKK1, Phnom Penh</li>
            <li>📍 <strong>Toul Kork Branch:</strong> St 271, Phsar Depo, Phnom Penh</li>
            <li>📞 <strong>Hotline:</strong> 012 888 992 / +855 23 888 999</li>
            <li>🛵 <strong>Delivery:</strong> 1-2H Grab/Nham24 in Phnom Penh</li>
            <li>💳 <strong>Payments:</strong> KHQR (ABA, Wing, ACLEDA) & COD</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>© {new Date().getFullYear()} NEXUS Mobile Store. Designed for University Final Project.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>React</span>
            <span>•</span>
            <span>Node.js REST API</span>
            <span>•</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
