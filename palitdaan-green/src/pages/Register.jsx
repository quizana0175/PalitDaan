import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/db';
import '../css/Register.css';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    email: '',
    role: 'student',
    department: 'College of Computer Studies',
    password: '',
    confirmPassword: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      registerUser({
        name: formData.name,
        idNumber: formData.idNumber,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        password: formData.password
      });

      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card-container">
        {/* Left Side Brand Info */}
        <div className="register-sidebar-panel">
          <div className="register-brand">
            <span className="register-brand-icon">🌿</span>
            <h1>PALIT DAAN</h1>
            <p>Join the Eco-Friendly Campus Canteen Ordering Community</p>
          </div>

          <div className="register-steps-list">
            <div className="register-step-item">
              <span className="step-num">1</span>
              <div>
                <strong>Create Your Account</strong>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>
                  Register your student or faculty credentials.
                </p>
              </div>
            </div>

            <div className="register-step-item">
              <span className="step-num">2</span>
              <div>
                <strong>Browse & Pre-Order</strong>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>
                  Select fresh meals & specify custom allergies.
                </p>
              </div>
            </div>

            <div className="register-step-item">
              <span className="step-num">3</span>
              <div>
                <strong>Express Counter Pickup</strong>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>
                  Skip the long queue and pick up immediately!
                </p>
              </div>
            </div>
          </div>

          <span className="register-badge-pill">CIT-U University Portal</span>
        </div>

        {/* Right Side Registration Form */}
        <div className="register-form-panel">
          <div className="register-form-header">
            <h2>Create Account</h2>
            <p>Register as a student, faculty member, or staff.</p>
          </div>

          {errorMsg && <div className="alert-box alert-error">⚠️ {errorMsg}</div>}
          {successMsg && <div className="alert-box alert-success">✓ {successMsg}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Maria Clara Santos"
                className="form-input"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="e.g. 22-1234-567"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Institutional Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@cit.edu.ph"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Campus Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="staff">University Staff</option>
                </select>
              </div>

              <div className="form-group">
                <label>College / Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="College of Computer Studies">College of Computer Studies</option>
                  <option value="College of Engineering">College of Engineering</option>
                  <option value="College of Business & Accountancy">College of Business</option>
                  <option value="College of Nursing">College of Nursing</option>
                  <option value="Senior High School">Senior High School</option>
                  <option value="Administrative Staff">Administrative Staff</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="register-submit-btn"
            >
              {loading ? 'Creating Account...' : 'Register Account →'}
            </button>

            <div className="login-link-row">
              <span>Already have an account?</span>
              <Link to="/">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
