import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateOrderStatus } from '../services/db';
import '../css/PendingOrders.css';

export default function PendingOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    try {
      const pending = JSON.parse(localStorage.getItem('pending_orders') || '[]');
      setOrders(pending);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage', loadOrders);
    window.addEventListener('orders-updated', loadOrders);
    return () => {
      window.removeEventListener('storage', loadOrders);
      window.removeEventListener('orders-updated', loadOrders);
    };
  }, []);

  const simulatePayment = (orderId) => {
    updateOrderStatus(orderId, 'Paid');
    loadOrders();
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Pending Payment':
        return { backgroundColor: '#fef3c7', color: '#b45309' };
      case 'Paid':
      case 'Paid & Preparing':
        return { backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'Being Prepared':
        return { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' };
      case 'Ready for Pickup':
        return { backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 800, border: '1px solid #86efac' };
      case 'Cancelled':
        return { backgroundColor: '#fee2e2', color: '#b91c1c' };
      default:
        return { backgroundColor: '#e2e8f0', color: '#475569' };
    }
  };

  return (
    <div className="pending-orders-container">
      <h1 className="po-title">Active & Pending Orders ⏳</h1>

      {orders.length === 0 ? (
        <div className="po-empty-state">
          <p>No active orders at the moment. Hungry for fresh campus meals?</p>
          <button className="po-order-btn" onClick={() => navigate('/menu')}>
            Order Food Now 🍔
          </button>
        </div>
      ) : (
        <div className="po-list">
          {orders.map((order) => {
            const badgeStyle = getStatusBadgeStyle(order.status);

            return (
              <div key={order.id} className="po-card">
                <div className="po-card-header">
                  <div>
                    <span className="po-order-id">{order.id}</span>
                    <span className="po-order-date">{order.date}</span>
                  </div>
                  <span
                    className="po-status-badge"
                    style={badgeStyle}
                  >
                    {order.status === 'Ready for Pickup' ? '🔔 Ready for Pickup!' : order.status}
                  </span>
                </div>

                <div className="po-items-section">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="po-item-row">
                      <div className="po-item-left">
                        <span className="po-item-qty">{item.quantity}x</span>
                        <span className="po-item-name">{item.food?.name}</span>
                        {item.allergens && item.allergens.length > 0 && (
                          <span className="po-item-allergens">
                            ({item.allergens.join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="po-item-price">
                        ₱{((item.food?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.items.some((item) => item.comment) && (
                  <div className="po-notes-section">
                    <strong>Special Kitchen Instructions:</strong>
                    <ul>
                      {order.items
                        .filter((item) => item.comment)
                        .map((item, idx) => (
                          <li key={idx}>
                            <em>{item.food?.name}:</em> "{item.comment}"
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="po-card-footer">
                  <div className="po-total">
                    <span>Total Amount:</span>
                    <span className="po-total-amount">
                      ₱{(order.total || 0).toFixed(2)}
                    </span>
                  </div>

                  {order.status === 'Pending Payment' ? (
                    <button
                      type="button"
                      className="po-pay-btn"
                      onClick={() => simulatePayment(order.id)}
                    >
                      <span>💳</span> Simulate OTC Cash Payment ₱
                    </button>
                  ) : order.status === 'Ready for Pickup' ? (
                    <span style={{ color: '#15803d', fontWeight: 800, fontSize: '1rem' }}>
                      🔔 Ready! Please pick up at Canteen Counter
                    </span>
                  ) : order.status === 'Being Prepared' ? (
                    <span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.95rem' }}>
                      🍳 Kitchen is currently preparing your food
                    </span>
                  ) : (
                    <span style={{ color: 'var(--primary-green)', fontWeight: 700, fontSize: '0.95rem' }}>
                      ✓ Payment Confirmed — In Queue
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
