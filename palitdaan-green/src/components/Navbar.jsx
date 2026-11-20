import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/db';
import '../css/Navbar.css';

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const updateState = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
      setCurrentUser(getCurrentUser());
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateState();
    window.addEventListener('storage', updateState);
    window.addEventListener('cart-updated', updateState);
    window.addEventListener('auth-updated', updateState);
    return () => {
      window.removeEventListener('storage', updateState);
      window.removeEventListener('cart-updated', updateState);
      window.removeEventListener('auth-updated', updateState);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/orders') {
      return location.pathname === '/orders' || location.pathname === '/pendingorders' || location.pathname === '/orderhistory';
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          onClick={toggleSidebar}
          className="navbar-toggle-btn"
          aria-label="Toggle navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="navbar-center">
            <span>🌿 PALIT DAAN</span>
            <span className="navbar-tag">Green Edition</span>
          </div>
        </Link>
      </div>

      <div className="navbar-links">
        {currentUser?.role === 'admin' && (
          <Link
            className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
            to="/admin"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', border: '1.5px solid #fff' }}
          >
            <span>🛡️</span> Admin Portal
          </Link>
        )}

        <Link className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard">
          <span>🏠</span> Home
        </Link>
        <Link className={`navbar-link ${isActive('/menu') ? 'active' : ''}`} to="/menu">
          <span>📋</span> Menu
        </Link>
        <Link className={`navbar-link ${isActive('/orders') ? 'active' : ''}`} to="/pendingorders">
          <span>📦</span> Orders
        </Link>
        <Link className={`navbar-link ${isActive('/cart') ? 'active' : ''}`} to="/cart">
          <span>🛒</span> Cart
          {cartCount > 0 && <span className="navbar-cart-pill">{cartCount}</span>}
        </Link>
        <Link className={`navbar-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">
          <span>👤</span> Profile
        </Link>
      </div>
    </nav>
  );
}
