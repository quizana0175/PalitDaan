import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/db';
import '../css/Sidebar.css';

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const checkState = () => {
    try {
      const pending = JSON.parse(localStorage.getItem('pending_orders') || '[]');
      setPendingCount(pending.length);
      setCurrentUser(getCurrentUser());
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    checkState();
    window.addEventListener('storage', checkState);
    window.addEventListener('orders-updated', checkState);
    window.addEventListener('auth-updated', checkState);
    return () => {
      window.removeEventListener('storage', checkState);
      window.removeEventListener('orders-updated', checkState);
      window.removeEventListener('auth-updated', checkState);
    };
  }, []);

  const menuItems = [
    ...(currentUser?.role === 'admin'
      ? [{ label: 'Admin Portal', path: '/admin', icon: '🛡️' }]
      : []),
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Food Menu', path: '/menu', icon: '🍔' },
    { label: 'Pending Orders', path: '/pendingorders', icon: '⏳', badge: pendingCount > 0 ? pendingCount : null },
    { label: 'Order History', path: '/orderhistory', icon: '📜' },
    { label: 'My Cart', path: '/cart', icon: '🛒' },
    { label: 'Profile Settings', path: '/profile', icon: '⚙️' }
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-title">Campus Canteen</div>
        <div className="sidebar-header-user">
          <span className="user-status-dot"></span>
          <span>
            {currentUser?.role === 'admin'
              ? 'Canteen Admin'
              : (currentUser?.name ? `${currentUser.name} (Student)` : 'Juan Dela Cruz (Student)')}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-logout-btn"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
