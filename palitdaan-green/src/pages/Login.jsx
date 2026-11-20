import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/db';
import '../css/Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    idNumber: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const session = loginUser(form.idNumber, form.password);
      if (session.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        {/* Left Side Brand Info */}
        <div className="login-sidebar-panel">
          <div className="login-brand">
            <span className="login-brand-icon">🌿</span>
            <h1>PALIT DAAN</h1>
            <p>Eco-Friendly Campus Canteen Online Ordering System</p>
          </div>

          <div className="login-features-list">
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              <span>Fast cashless order pre-booking</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              <span>Live canteen queue & order status tracking</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              <span>Admin order tagging & live inventory stock control</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-dot"></span>
              <span>Supabase-ready cloud storage architecture</span>
            </div>
          </div>

          <span className="login-badge-pill">CIT-U University Edition</span>
        </div>

        {/* Right Side Login Form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h2>Welcome Back!</h2>
            <p>Please enter your student or admin credentials.</p>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '14px',
              border: '1px solid #f87171'
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="idNumber">Student / Admin ID or Email</label>
              <input
                id="idNumber"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 21-1234-567 or admin@cit.edu.ph"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="login-actions">
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                <span>{loading ? 'Verifying...' : 'Sign In to Canteen'}</span>
                <span>→</span>
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Don't have an account yet?</span>
              <Link
                to="/register"
                style={{
                  color: 'var(--primary-green)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginLeft: '6px'
                }}
              >
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
