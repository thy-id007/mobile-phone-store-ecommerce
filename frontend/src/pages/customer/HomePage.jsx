import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  Flame,
  Truck,
  Headphones,
  Award,
} from 'lucide-react';
import { productApi } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  const [featuredPhones, setFeaturedPhones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [phonesRes, brandsRes, catsRes] = await Promise.all([
          productApi.getProducts({ is_featured: 'true', limit: 8 }),
          productApi.getBrands(),
          productApi.getCategories(),
        ]);

        if (phonesRes.success) setFeaturedPhones(phonesRes.data || []);
        if (brandsRes.success) setBrands(brandsRes.data || []);
        if (catsRes.success) setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Error loading home data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '70px' }}>
      
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 60px',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.15), transparent 60%)',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '20px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-cyan)', letterSpacing: '0.5px' }}>
                {t('hero_badge')}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '20px' }}>
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t('hero_title')}
              </span>
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '32px', maxWidth: '520px' }}>
              {t('hero_subtitle')}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <Link to="/catalog" className="btn btn-primary btn-lg" style={{ gap: '10px' }}>
                <span>{t('view_catalog')}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/compare" className="btn btn-secondary btn-lg" style={{ gap: '10px' }}>
                <SlidersHorizontal size={18} />
                <span>{t('compare_phones')}</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '30px', marginTop: '40px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>100%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('trust_genuine')}</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)' }}>0%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Financing Available</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>1 Year</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('trust_warranty')}</div>
              </div>
            </div>
          </div>

          {/* Hero Featured Device Visual Showcase */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '460px',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '30px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="badge badge-blue">FLAGSHIP HIGHLIGHT</span>
                <span style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: '700' }}>Apple A18 Pro · 3nm</span>
              </div>

              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '16px', background: '#070b14', marginBottom: '20px' }}>
                <img
                  src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80"
                  alt="iPhone 16 Pro Max Showcase"
                  style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>iPhone 16 Pro Max</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Desert Titanium · 256GB</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-cyan)' }}>$1,199</div>
                  <Link to="/product/apple-iphone-15-pro-max" style={{ fontSize: '12px', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
                    {t('view_details')} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRANDS LOGO GRID */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>{t('shop_by_brand')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Official distributor for world-renowned mobile manufacturers</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/catalog?brand=${brand.slug}`}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#0a0f1d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img src={brand.logo_url} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#fff' }}>{brand.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{brand.product_count || 'Official'} models</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PHONES GRID */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
              <Flame size={16} />
              <span>TRENDING NOW</span>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800' }}>{t('featured_phones')}</h2>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-blue)', fontSize: '14px', fontWeight: '600' }}>
            <span>{t('view_catalog')} ({featuredPhones.length})</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading collection...
          </div>
        ) : (
          <div className="product-grid">
            {featuredPhones.map((phone) => (
              <ProductCard key={phone.id} product={phone} />
            ))}
          </div>
        )}
      </section>

      {/* 4. TRUST & ASSURANCE BADGES */}
      <section className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={24} color="var(--accent-cyan)" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t('trust_genuine')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{t('trust_genuine_desc')}</p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={24} color="var(--success)" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t('trust_warranty')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{t('trust_warranty_desc')}</p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={24} color="var(--warning)" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t('trust_delivery')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{t('trust_delivery_desc')}</p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Headphones size={24} color="#a855f7" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{t('trust_support')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{t('trust_support_desc')}</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
