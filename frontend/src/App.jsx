import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/common/CartDrawer';
import CompareFloatingBar from './components/common/CompareFloatingBar';
import AdminSidebar from './components/layout/AdminSidebar';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import CatalogPage from './pages/customer/CatalogPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import ComparePage from './pages/customer/ComparePage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import ProfilePage from './pages/customer/ProfilePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';

// Customer Layout Wrapper
const CustomerLayout = () => {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CompareFloatingBar />
    </div>
  );
};

// Admin Layout Wrapper with Role Guard
const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Checking authorization...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
        <Outlet />
      </div>
    </div>
  );
};

// Protected Customer Route
const ProtectedCustomerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading account...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <Routes>
                {/* Customer Portal Routes */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Customer Authenticated Only */}
                  <Route element={<ProtectedCustomerRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
