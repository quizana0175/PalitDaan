import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItems, getCurrentUser } from '../services/db';
import '../css/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const pending = JSON.parse(localStorage.getItem('pending_orders') || '[]');
      setPendingCount(pending.length);
      setMenuItems(getMenuItems());
      setCurrentUser(getCurrentUser());
    } catch {
      setPendingCount(0);
    }
  }, []);

  const popularPicks = menuItems.slice(0, 3);

  const handleQuickOrder = (food) => {
    if (food.isSoldOut) return;
    navigate('/special-instructions', { state: { food } });
  };

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-badge">Campus Dining Reimagined</span>
          <h1>Unsa imo ganahan paliton karon{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}?</h1>
          <p>
            Welcome to the fresh PalitDaan Green experience! Skip long canteen queues,
            customize allergen notes, and pick up your meals hot and ready.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn" onClick={() => navigate('/menu')}>
              <span>🍔</span> Browse Full Menu
            </button>
            {pendingCount > 0 && (
              <button className="hero-btn-secondary" onClick={() => navigate('/pendingorders')}>
                ⏳ Track {pendingCount} Pending Order{pendingCount > 1 ? 's' : ''}
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                className="hero-btn-secondary"
                style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderColor: '#fff' }}
                onClick={() => navigate('/admin')}
              >
                🛡️ Open Admin Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-icon green">🥗</div>
          <div className="metric-info">
            <h4>Fresh & Local</h4>
            <p>Quality ingredients prepared daily</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon gold">⚡</div>
          <div className="metric-info">
            <h4>Express Pickup</h4>
            <p>5-10 mins average prep time</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">💳</div>
          <div className="metric-info">
            <h4>Easy Cashless / OTC</h4>
            <p>Simulate instant counter payment</p>
          </div>
        </div>
      </div>

      {/* Popular Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Popular Campus Picks 🔥</h2>
          <button className="text-btn" onClick={() => navigate('/menu')}>
            See All Menu Items →
          </button>
        </div>

        <div className="popular-grid">
          {popularPicks.map((item) => (
            <div
              key={item.id}
              className="popular-card"
              onClick={() => handleQuickOrder(item)}
              style={{ opacity: item.isSoldOut ? 0.8 : 1 }}
            >
              <div className="card-img-container">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ filter: item.isSoldOut ? 'grayscale(80%)' : 'none' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80';
                  }}
                />
                <span className="card-category-tag">{item.category}</span>
                <span className="card-rating">★ {item.rating}</span>
                {item.isSoldOut && (
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '12px'
                  }}>
                    SOLD OUT
                  </span>
                )}
              </div>
              <div className="card-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="card-footer">
                  <span className="card-price">₱{item.price.toFixed(2)}</span>
                  {item.isSoldOut ? (
                    <button
                      className="order-btn"
                      disabled
                      style={{ backgroundColor: '#cbd5e1', cursor: 'not-allowed', color: '#64748b' }}
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      className="order-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickOrder(item);
                      }}
                    >
                      Order Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
