import React, { useState, useEffect } from 'react';
import { ShoppingBag, Edit, CheckCircle, Truck, Clock, X } from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('processing');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders(filterStatus ? { status: filterStatus } : {});
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      await adminApi.updateOrderStatus(selectedOrder.id, {
        order_status: newStatus,
        tracking_number: trackingNumber || undefined,
      });
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge badge-green">Delivered</span>;
      case 'shipped':
        return <span className="badge badge-blue">Shipped</span>;
      case 'processing':
        return <span className="badge badge-amber">Processing</span>;
      case 'cancelled':
        return <span className="badge badge-red">Cancelled</span>;
      default:
        return <span className="badge badge-amber">Pending</span>;
    }
  };

  return (
    <div style={{ padding: '36px 40px' }}>
      
      {/* Header & Status Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Customer Order Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Review incoming orders, assign courier tracking, and update status</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn ${filterStatus === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ textTransform: 'capitalize' }}
            >
              {st || 'All Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '14px 16px' }}>ORDER #</th>
                <th style={{ padding: '14px 16px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 16px' }}>ITEMS</th>
                <th style={{ padding: '14px 16px' }}>AMOUNT</th>
                <th style={{ padding: '14px 16px' }}>STATUS</th>
                <th style={{ padding: '14px 16px' }}>TRACKING</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders found matching this status filter.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      {o.order_number}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{o.customer_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.customer_email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {o.item_count || 1} units
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '800' }}>
                      ${parseFloat(o.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {getStatusBadge(o.order_status)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {o.tracking_number || 'Unassigned'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setNewStatus(o.order_status);
                          setTrackingNumber(o.tracking_number || '');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <Edit size={14} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Update Order #{selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Order Fulfillment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="select-field"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing (Packaging)</option>
                  <option value="shipped">Shipped (In Transit)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Courier Tracking Reference</label>
                <input
                  type="text"
                  placeholder="e.g. DHL-EXPRESS-98231"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn btn-primary">
                  {updating ? 'Saving...' : 'Apply Status Update'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;
