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
} from 'lucide-react';
import { productApi } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';

const HomePage = () => {
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
                2026 TITANIUM FLAGSHIP ARRIVALS
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1.1', marginBottom: '20px' }}>
              Next-Gen Power.<br />
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Unmatched Precision.
              </span>
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '32px', maxWidth: '520px' }}>
              Experience the pinnacle of mobile hardware: 3nm ray-tracing processors, periscope optical zoom, and aerospace-grade titanium chassis.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <Link to="/catalog" className="btn btn-primary btn-lg" style={{ gap: '10px' }}>
                <span>Explore Catalog</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/compare" className="btn btn-secondary btn-lg" style={{ gap: '10px' }}>
                <SlidersHorizontal size={18} />
                <span>Compare Specs</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '30px', marginTop: '40px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>100%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Official Manufacturer Stock</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)' }}>0%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Installment Financing</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--success)' }}>2 Years</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hardware Warranty</div>
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
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #162032 0%, #0c121e 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(59, 130, 246, 0.2)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-blue">TOP FEATURED</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>A17 Pro (3nm)</span>
              </div>
              
              <img
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
                alt="iPhone 15 Pro Max Titanium"
                style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>iPhone 15 Pro Max</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Natural Titanium • 256GB</p>
                </div>
                <Link to="/product/apple-iphone-15-pro-max" className="btn btn-primary btn-sm">
                  View Phone
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TOP BRANDS SHOWCASE */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>Official Partner Brands</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Browse smartphones by world-class manufacturers</p>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-blue)', fontSize: '14px', fontWeight: '600' }}>
            <span>View All</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/catalog?brand=${brand.slug}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '24px 16px',
                gap: '12px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#090d16',
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
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{brand.product_count} models</div>
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
            <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Featured Smartphones</h2>
          </div>
          <Link to="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-blue)', fontSize: '14px', fontWeight: '600' }}>
            <span>Explore All ({featuredPhones.length})</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading flagship collection...
          </div>
        ) : (
          <div className="product-grid">
            {featuredPhones.map((phone) => (
              <ProductCard key={phone.id} product={phone} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PHONE COMPARISON SPOTLIGHT BANNER */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #162032 0%, #111b2b 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '50px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '14px' }}>
              DECISION ENGINE
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
              Can't Decide? Compare Up to 4 Phones Side-by-Side.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
              Analyze raw hardware differences in screen PPI, camera sensors, battery capacity, fast charging speeds, and benchmark processors.
            </p>
            <Link to="/compare" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
              <SlidersHorizontal size={18} />
              <span>Launch Comparison Matrix</span>
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📱</div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>iPhone 15 Pro Max</div>
              <div style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>Apple A17 Pro (3nm)</div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚡</div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>Galaxy S24 Ultra</div>
              <div style={{ fontSize: '12px', color: 'var(--success)' }}>200MP Quad Tele & S-Pen</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
