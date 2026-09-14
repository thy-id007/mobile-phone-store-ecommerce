import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingCart } from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getCustomers();
        if (res.success) {
          setCustomers(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load customers:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="admin-content-padding">
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Registered Customers</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Overview of registered shoppers, total purchases, and lifetime spending</p>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 16px' }}>CUSTOMER NAME</th>
                <th style={{ padding: '14px 16px' }}>EMAIL ADDRESS</th>
                <th style={{ padding: '14px 16px' }}>PHONE</th>
                <th style={{ padding: '14px 16px' }}>JOINED DATE</th>
                <th style={{ padding: '14px 16px' }}>ORDERS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>LIFETIME SPEND</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading customer accounts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#fff' }}>
                      {c.full_name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {c.email}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {c.phone || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                      {c.total_orders} orders
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '800', color: 'var(--success)' }}>
                      ${parseFloat(c.total_spent || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminCustomersPage;
