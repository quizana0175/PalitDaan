import React, { useState, useEffect } from 'react';
import '../css/OrderHistory.css';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('order_history') || '[]');
      setOrders(history);
    } catch {
      setOrders([]);
    }
  }, []);

  const formatFoodNames = (orderItems) => {
    if (!orderItems || orderItems.length === 0) return 'No items';
    if (orderItems.length === 1) return orderItems[0].food?.name || 'Item';
    return `${orderItems[0].food?.name || 'Item'} + ${orderItems.length - 1} other${
      orderItems.length > 2 ? 's' : ''
    }`;
  };

  return (
    <div className="oh-container">
      <div className="oh-header">
        <h1>Order History 📜</h1>
        <p>View all previous completed orders and digital receipts</p>
      </div>

      {orders.length === 0 ? (
        <div className="oh-empty-state">
          <p>
            No completed orders found yet. Once you place an order and simulate payment,
            your official receipt will be archived here!
          </p>
        </div>
      ) : (
        <div className="oh-table-wrapper">
          <table className="oh-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Dishes Ordered</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="oh-order-id-col">{order.id}</td>
                  <td>{formatFoodNames(order.items)}</td>
                  <td>{order.date ? order.date.split(' ')[0] : 'Today'}</td>
                  <td className="oh-amount-col">₱{(order.total || 0).toFixed(2)}</td>
                  <td>
                    <span className="oh-status-badge">Completed ✓</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="oh-view-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedOrder && (
        <div className="oh-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="oh-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="oh-modal-header">
              <h2>DIGITAL ORDER RECEIPT</h2>
              <button
                type="button"
                className="oh-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close receipt"
              >
                ×
              </button>
            </div>

            <div className="oh-receipt-body">
              <div className="receipt-header-details">
                <p>
                  <span>Order Reference:</span>
                  <strong>{selectedOrder.id}</strong>
                </p>
                <p>
                  <span>Timestamp:</span>
                  <span>{selectedOrder.date}</span>
                </p>
                <p>
                  <span>Customer:</span>
                  <span>{selectedOrder.customer || 'Juan Dela Cruz'}</span>
                </p>
                <p>
                  <span>Payment Method:</span>
                  <span className="receipt-paid-tag">PAID OTC (CASH)</span>
                </p>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-items-list">
                <h3>Items Breakdown:</h3>
                {selectedOrder.items &&
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="receipt-item-row">
                      <div className="receipt-item-left">
                        <span className="receipt-item-qty">{item.quantity}x</span>
                        <span className="receipt-item-name">{item.food?.name}</span>
                        {item.allergens && item.allergens.length > 0 && (
                          <span className="receipt-item-allergens">
                            ({item.allergens.join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="receipt-item-price">
                        ₱{((item.food?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="receipt-total-row">
                <span>Total Amount Paid:</span>
                <span style={{ color: 'var(--primary-green)' }}>
                  ₱{(selectedOrder.total || 0).toFixed(2)}
                </span>
              </div>

              <p className="receipt-footer-msg">
                🌱 Thank you for choosing PalitDaan Green campus dining!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
