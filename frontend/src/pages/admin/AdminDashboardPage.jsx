import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Smartphone, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDashboard();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { title: 'Total Gross Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'var(--success)' },
    { title: 'Total Orders Processed', value: stats.totalOrders, icon: ShoppingBag, color: 'var(--accent-blue)' },
    { title: 'Active Mobile Phones', value: stats.totalProducts, icon: Smartphone, color: 'var(--accent-cyan)' },
    { title: 'Low Inventory Alerts', value: `${stats.lowStockCount} SKUs`, icon: AlertTriangle, color: 'var(--warning)' },
  ];

  return (
    <div className="admin-content-padding">
      
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Real-time sales, order fulfillment, and inventory analytics</p>
        </div>
        <Link to="/admin/products" className="btn btn-primary btn-sm">
          + Add New Phone
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {statCards.map((card) => (
          <div key={card.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
              <card.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{card.title}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                {loading ? '...' : card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Customer Orders</h2>
          <Link to="/admin/orders" style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Manage All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '12px 16px' }}>ORDER #</th>
                <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '12px 16px' }}>AMOUNT</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>DATE</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {o.order_number}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#fff' }}>
                      {o.customer_name}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                      ${parseFloat(o.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-amber">{o.order_status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link to="/admin/orders" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '12px' }}>
                        Update
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
