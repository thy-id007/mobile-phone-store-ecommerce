import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { productApi } from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

const CatalogPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from URL search params
  const currentSearch = searchParams.get('search') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentRam = searchParams.get('ram') || '';
  const currentStorage = searchParams.get('storage') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          productApi.getBrands(),
          productApi.getCategories(),
        ]);
        if (bRes.success) setBrands(bRes.data || []);
        if (cRes.success) setCategories(cRes.data || []);
      } catch (err) {
        console.error('Error fetching metadata:', err.message);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (currentSearch) params.search = currentSearch;
        if (currentBrand) params.brand = currentBrand;
        if (currentCategory) params.category = currentCategory;
        if (currentSort) params.sort = currentSort;
        if (currentRam) params.ram = currentRam;
        if (currentStorage) params.storage = currentStorage;
        if (currentMinPrice) params.minPrice = currentMinPrice;
        if (currentMaxPrice) params.maxPrice = currentMaxPrice;

        const res = await productApi.getProducts(params);
        if (res.success) {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.error('Error loading products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const activeFiltersCount = [
    currentSearch,
    currentBrand,
    currentCategory,
    currentRam,
    currentStorage,
    currentMinPrice,
    currentMaxPrice,
  ].filter(Boolean).length;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>{t('catalog', 'Smartphones Catalog')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {products.length} {t('results_found', 'smartphones found')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn btn-secondary mobile-filter-btn"
            style={{ display: 'none' }}
          >
            <Filter size={16} />
            <span>{t('filters', 'Filters')} ({activeFiltersCount})</span>
          </button>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="select-field"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="newest">{t('sort_newest', 'Newest Arrivals')}</option>
              <option value="price_asc">{t('sort_price_asc', 'Price: Low to High')}</option>
              <option value="price_desc">{t('sort_price_desc', 'Price: High to Low')}</option>
              <option value="rating">{t('sort_rating', 'Top Customer Rated')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'start' }} className="catalog-layout">
        
        {/* SIDEBAR FILTER PANEL */}
        <aside
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
          className="desktop-filter-sidebar"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '16px' }}>
              <Filter size={18} color="var(--accent-blue)" />
              <span>{t('filters', 'Filters')}</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                {t('clear_filters', 'Reset all')}
              </button>
            )}
          </div>

          {/* Search inside catalog */}
          <div>
            <label className="form-label">{t('search_placeholder', 'Search Keyword')}</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={t('search_placeholder', 'Search models...')}
                value={currentSearch}
                onChange={(e) => updateParam('search', e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="form-label">{t('brands', 'Manufacturer / Brand')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => updateParam('brand', '')}
                style={{
                  textAlign: 'left',
                  background: !currentBrand ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: !currentBrand ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: !currentBrand ? '700' : '500',
                  fontSize: '13px',
                }}
              >
                {t('all_brands', 'All Brands')}
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => updateParam('brand', b.slug)}
                  style={{
                    textAlign: 'left',
                    background: currentBrand === b.slug ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: currentBrand === b.slug ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: currentBrand === b.slug ? '700' : '500',
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{b.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.product_count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="form-label">{t('categories', 'Category')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => updateParam('category', '')}
                style={{
                  textAlign: 'left',
                  background: !currentCategory ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  color: !currentCategory ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: !currentCategory ? '700' : '500',
                  fontSize: '13px',
                }}
              >
                {t('all_categories', 'All Categories')}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam('category', c.slug)}
                  style={{
                    textAlign: 'left',
                    background: currentCategory === c.slug ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: currentCategory === c.slug ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: currentCategory === c.slug ? '700' : '500',
                    fontSize: '13px',
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* RAM Options */}
          <div>
            <label className="form-label">{t('ram', 'RAM Memory')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['8GB', '12GB', '16GB'].map((ram) => (
                <button
                  key={ram}
                  onClick={() => updateParam('ram', currentRam === ram ? '' : ram)}
                  className={`btn ${currentRam === ram ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Options */}
          <div>
            <label className="form-label">{t('storage', 'Storage Capacity')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['128GB', '256GB', '512GB', '1TB'].map((storage) => (
                <button
                  key={storage}
                  onClick={() => updateParam('storage', currentStorage === storage ? '' : storage)}
                  className={`btn ${currentStorage === storage ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCTS GRID AREA */}
        <div>
          {/* Active Filter Badges */}
          {activeFiltersCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active filters:</span>
              {currentBrand && (
                <span className="badge badge-blue" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => updateParam('brand', '')}>
                  Brand: {currentBrand} <X size={12} />
                </span>
              )}
              {currentCategory && (
                <span className="badge badge-blue" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => updateParam('category', '')}>
                  Category: {currentCategory} <X size={12} />
                </span>
              )}
              {currentRam && (
                <span className="badge badge-blue" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => updateParam('ram', '')}>
                  RAM: {currentRam} <X size={12} />
                </span>
              )}
              {currentStorage && (
                <span className="badge badge-blue" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => updateParam('storage', '')}>
                  Storage: {currentStorage} <X size={12} />
                </span>
              )}
              {currentSearch && (
                <span className="badge badge-blue" style={{ gap: '6px', cursor: 'pointer' }} onClick={() => updateParam('search', '')}>
                  Keyword: "{currentSearch}" <X size={12} />
                </span>
              )}
            </div>
          )}

          {/* Catalog Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
              Filtering mobile phones...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <SlidersHorizontal size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No smartphones match your filters</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                Try relaxing your RAM, brand, or price constraints to see more options.
              </p>
              <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((phone) => (
                <ProductCard key={phone.id} product={phone} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FILTER SLIDE-OVER DRAWER */}
      {mobileFilterOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              height: '100%',
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '24px 20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '17px' }}>
                <Filter size={18} color="var(--accent-blue)" />
                <span>{t('filters', 'Filters')}</span>
                {activeFiltersCount > 0 && <span className="badge badge-blue">{activeFiltersCount}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {t('clear_filters', 'Reset')}
                  </button>
                )}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: '#fff', padding: '6px', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="form-label">{t('search_placeholder', 'Search Keyword')}</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder={t('search_placeholder', 'Search models...')}
                  value={currentSearch}
                  onChange={(e) => updateParam('search', e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '36px', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="form-label">{t('brands', 'Manufacturer / Brand')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                <button
                  onClick={() => updateParam('brand', '')}
                  style={{
                    textAlign: 'left',
                    background: !currentBrand ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: !currentBrand ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: !currentBrand ? '700' : '500',
                    fontSize: '13px',
                  }}
                >
                  {t('all_brands', 'All Brands')}
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => updateParam('brand', b.slug)}
                    style={{
                      textAlign: 'left',
                      background: currentBrand === b.slug ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      color: currentBrand === b.slug ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: currentBrand === b.slug ? '700' : '500',
                      fontSize: '13px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{b.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.product_count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label">{t('categories', 'Category')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => updateParam('category', '')}
                  style={{
                    textAlign: 'left',
                    background: !currentCategory ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    color: !currentCategory ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: !currentCategory ? '700' : '500',
                    fontSize: '13px',
                  }}
                >
                  {t('all_categories', 'All Categories')}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam('category', c.slug)}
                    style={{
                      textAlign: 'left',
                      background: currentCategory === c.slug ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      color: currentCategory === c.slug ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: currentCategory === c.slug ? '700' : '500',
                      fontSize: '13px',
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Options */}
            <div>
              <label className="form-label">{t('ram', 'RAM Memory')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['8GB', '12GB', '16GB'].map((ram) => (
                  <button
                    key={ram}
                    onClick={() => updateParam('ram', currentRam === ram ? '' : ram)}
                    className={`btn ${currentRam === ram ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Options */}
            <div>
              <label className="form-label">{t('storage', 'Storage Capacity')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['128GB', '256GB', '512GB', '1TB'].map((storage) => (
                  <button
                    key={storage}
                    onClick={() => updateParam('storage', currentStorage === storage ? '' : storage)}
                    className={`btn ${currentStorage === storage ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', minHeight: '44px' }}
            >
              Show {products.length} Results
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) {
          .catalog-layout { grid-template-columns: 1fr !important; }
          .desktop-filter-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};

export default CatalogPage;
