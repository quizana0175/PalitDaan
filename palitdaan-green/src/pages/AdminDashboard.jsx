import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllOrders,
  updateOrderStatus,
  getMenuItems,
  toggleSoldOut,
  updateStock,
  getCurrentUser,
  logoutUser
} from '../services/db';
import { isSupabaseConfigured } from '../services/supabaseClient';
import '../css/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'supabase'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ordersData, setOrdersData] = useState({ pending: [], history: [] });
  const [menuItems, setMenuItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadData = () => {
    setOrdersData(getAllOrders());
    setMenuItems(getMenuItems());
    setCurrentUser(getCurrentUser());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('orders-updated', loadData);
    window.addEventListener('menu-updated', loadData);
    return () => {
      window.removeEventListener('orders-updated', loadData);
      window.removeEventListener('menu-updated', loadData);
    };
  }, []);

  // Combine and sort orders
  const allOrdersList = [...ordersData.pending, ...ordersData.history];

  // Calculate metrics
  const totalRevenue = allOrdersList
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingCount = ordersData.pending.filter((o) => o.status === 'Pending Payment').length;
  const preparingCount = ordersData.pending.filter((o) => o.status === 'Being Prepared' || o.status === 'Paid & Preparing').length;
  const soldOutCount = menuItems.filter((i) => i.isSoldOut).length;

  const handleTagOrder = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const handleToggleSoldOut = (foodId) => {
    toggleSoldOut(foodId);
    loadData();
  };

  const handleStockChange = (foodId, delta) => {
    const item = menuItems.find((i) => i.id === foodId);
    if (item) {
      const newStock = Math.max(0, (item.stock || 0) + delta);
      updateStock(foodId, newStock);
      loadData();
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Filtered orders list
  const filteredOrders = allOrdersList.filter((order) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return order.status === 'Pending Payment';
    if (statusFilter === 'PREPARING') return order.status.includes('Prepar') || order.status === 'Paid';
    if (statusFilter === 'READY') return order.status === 'Ready for Pickup';
    if (statusFilter === 'COMPLETED') return order.status === 'Completed';
    return true;
  });

  return (
    <div className="admin-container">
      {/* Top Banner */}
      <header className="admin-header">
        <div className="admin-header-title">
          <h1>
            <span>🛡️</span> Canteen Admin & Inventory Portal
          </h1>
          <p>
            Logged in as: <strong>Canteen Admin</strong>
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-action-btn"
            onClick={() => navigate('/dashboard')}
            title="View menu from student perspective"
          >
            <span>👀</span> View Customer Mode
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-icon green">₱</div>
          <div className="admin-metric-info">
            <h3>₱{totalRevenue.toFixed(2)}</h3>
            <p>Total Canteen Revenue</p>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon yellow">⏳</div>
          <div className="admin-metric-info">
            <h3>{pendingCount}</h3>
            <p>Pending Counter Payments</p>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon blue">🍳</div>
          <div className="admin-metric-info">
            <h3>{preparingCount}</h3>
            <p>Meals Currently Preparing</p>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon red">⚠️</div>
          <div className="admin-metric-info">
            <h3>{soldOutCount}</h3>
            <p>Sold Out Menu Dishes</p>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Live Orders & Tagging ({allOrdersList.length})
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          🥗 Menu Stock & Sold-Out Control ({menuItems.length})
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'supabase' ? 'active' : ''}`}
          onClick={() => setActiveTab('supabase')}
        >
          ⚡ Supabase Cloud Storage {isSupabaseConfigured ? '✓ Connected' : '(Ready)'}
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Order Tracking & Status Tagging</h2>

            <div className="status-filter-pills">
              {['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-pill ${statusFilter === filter ? 'active' : ''}`}
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
              No orders found matching the selected filter.
            </p>
          ) : (
            <div className="admin-orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="admin-order-card">
                  <div className="order-top-row">
                    <div className="order-customer-info">
                      <span style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1.1rem' }}>
                        {order.id}
                      </span>
                      <span className="customer-name">
                        👤 {order.customer || 'Student Customer'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        🕒 {order.date}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        backgroundColor:
                          order.status === 'Completed'
                            ? '#dcfce7'
                            : order.status === 'Pending Payment'
                            ? '#fef3c7'
                            : '#e0f2fe',
                        color:
                          order.status === 'Completed'
                            ? '#15803d'
                            : order.status === 'Pending Payment'
                            ? '#b45309'
                            : '#0369a1'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="order-items-grid">
                    {order.items &&
                      order.items.map((item, idx) => (
                        <div key={idx} className="order-item-badge-row">
                          <div>
                            <strong>{item.quantity}x</strong> {item.food?.name}{' '}
                            {item.allergens && item.allergens.length > 0 && (
                              <span style={{ color: '#b45309', fontSize: '0.8rem', background: '#fef3c7', padding: '1px 6px', borderRadius: '4px' }}>
                                (⚠️ {item.allergens.join(', ')})
                              </span>
                            )}
                            {item.comment && (
                              <span style={{ fontStyle: 'italic', color: '#166534', marginLeft: '8px', fontSize: '0.85rem' }}>
                                "{item.comment}"
                              </span>
                            )}
                          </div>
                          <span style={{ fontWeight: 700 }}>
                            ₱{((item.food?.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Status Action Buttons Bar */}
                  <div className="order-actions-bar">
                    <div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order Total: </span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--primary-green)' }}>
                        ₱{(order.total || 0).toFixed(2)}
                      </strong>
                    </div>

                    <div className="tag-buttons-group">
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, alignSelf: 'center', marginRight: '4px' }}>
                        Tag as:
                      </span>
                      <button
                        type="button"
                        className="tag-btn paid"
                        onClick={() => handleTagOrder(order.id, 'Paid')}
                        title="Mark payment received at counter"
                      >
                        ✓ Paid
                      </button>

                      <button
                        type="button"
                        className="tag-btn preparing"
                        onClick={() => handleTagOrder(order.id, 'Being Prepared')}
                        title="Notify customer order is cooking in kitchen"
                      >
                        🍳 Being Prepared
                      </button>

                      <button
                        type="button"
                        className="tag-btn ready"
                        onClick={() => handleTagOrder(order.id, 'Ready for Pickup')}
                        title="Food is ready on counter for pickup"
                      >
                        🔔 Ready for Pickup
                      </button>

                      <button
                        type="button"
                        className="tag-btn completed"
                        onClick={() => handleTagOrder(order.id, 'Completed')}
                        title="Mark order collected and completed"
                      >
                        🎉 Completed
                      </button>

                      <button
                        type="button"
                        className="tag-btn cancelled"
                        onClick={() => handleTagOrder(order.id, 'Cancelled')}
                        title="Cancel order"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
      {activeTab === 'inventory' && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Canteen Inventory & Sold Out Controls</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Toggling an item to <strong>Sold Out</strong> disables it immediately on the customer menu.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Available</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.image} alt={item.name} className="item-thumbnail" />
                        <div>
                          <strong>{item.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {item.calories}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <strong>₱{item.price.toFixed(2)}</strong>
                    </td>
                    <td>
                      <div className="stock-control">
                        <button
                          type="button"
                          className="stock-btn"
                          onClick={() => handleStockChange(item.id, -1)}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>
                          {item.stock ?? 20}
                        </span>
                        <button
                          type="button"
                          className="stock-btn"
                          onClick={() => handleStockChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {item.isSoldOut ? (
                        <span style={{ color: '#b91c1c', fontWeight: 800, background: '#fee2e2', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                          SOLD OUT
                        </span>
                      ) : (
                        <span style={{ color: '#15803d', fontWeight: 800, background: '#dcfce7', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                          IN STOCK
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`sold-out-toggle ${item.isSoldOut ? 'sold-out' : 'in-stock'}`}
                        onClick={() => handleToggleSoldOut(item.id)}
                      >
                        {item.isSoldOut ? 'Restock / In Stock ↻' : 'Tag as Sold Out ✕'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: SUPABASE INTEGRATION DETAILS */}
      {activeTab === 'supabase' && (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Supabase Cloud Storage Integration</h2>
          </div>

          <div style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>
            <p>
              This project includes a built-in modular database layer ([`src/services/db.js`](file:///c:/Users/Admin/Downloads/PalitDaan/palitdaan-green/src/services/db.js))
              and Supabase client adapter ([`src/services/supabaseClient.js`](file:///c:/Users/Admin/Downloads/PalitDaan/palitdaan-green/src/services/supabaseClient.js)).
            </p>

            <h3 style={{ marginTop: '16px', color: 'var(--primary-dark)' }}>How to connect to your Supabase Project:</h3>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Create a new project at <strong>https://supabase.com</strong>.</li>
              <li>Go to the <strong>SQL Editor</strong> tab in your Supabase Dashboard.</li>
              <li>Open and copy the contents of <strong><code>SUPABASE_SETUP.sql</code></strong> in this project, paste it into Supabase, and click <strong>Run</strong>.</li>
              <li>Create a <strong><code>.env</code></strong> file in this project with your project keys:
                <pre style={{ background: '#f1f5f9', padding: '12px', borderRadius: '6px', margin: '8px 0' }}>
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
                </pre>
              </li>
              <li>That's it! The app will automatically connect to your live Supabase cloud database, while keeping local storage fallback whenever offline.</li>
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}
