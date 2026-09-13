import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ChevronRight } from 'lucide-react';
import { orderApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getUserOrders();
        if (res.success) {
          setOrders(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedOrder(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load orders:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge badge-green">Delivered</span>;
      case 'shipped':
        return <span className="badge badge-blue">Shipped</span>;
      case 'processing':
        return <span className="badge badge-amber">Processing</span>;
      default:
        return <span className="badge badge-amber">Pending Verification</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>My Orders & Shipments</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Track past mobile phone purchases and live logistics status
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          Retrieving order receipts...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            When you purchase a smartphone from NEXUS, your invoice and tracking details will appear here.
          </p>
          <Link to="/catalog" className="btn btn-primary">
            Explore All Smartphones
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
          
          {/* Orders Roster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((o) => {
              const isSelected = selectedOrder?.id === o.id;
              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  style={{
                    background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>{o.order_number}</span>
                    {getStatusBadge(o.order_status)}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Placed on {new Date(o.created_at).toLocaleDateString()} • {o.items?.length || 1} items
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Payment: {o.payment_method}</span>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>${parseFloat(o.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Order Detailed Receipt */}
          {selectedOrder && (
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RECEIPT SUMMARY</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{selectedOrder.order_number}</div>
                </div>
                {getStatusBadge(selectedOrder.order_status)}
              </div>

              {/* Items in order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>{it.product_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{it.variant_details}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Qty: {it.quantity} × ${parseFloat(it.unit_price).toFixed(2)}</div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>${parseFloat(it.total_price).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Order financial breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                {parseFloat(selectedOrder.discount_amount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Discount</span>
                    <span>-${parseFloat(selectedOrder.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span>${parseFloat(selectedOrder.shipping_fee).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '800', color: '#fff', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <span>Total Amount Paid</span>
                  <span>${parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  SHIPMENT TRACKING STATUS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <Truck size={18} color="var(--accent-cyan)" />
                  <span>Tracking Number: <strong>{selectedOrder.tracking_number || 'TRK-NEXUS-PENDING'}</strong></span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default OrdersPage;
