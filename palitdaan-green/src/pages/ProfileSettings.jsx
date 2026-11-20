import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, getCurrentUser } from '../services/db';
import '../css/ProfileSettings.css';

export default function ProfileSettings() {
  const [profile, setProfile] = useState(() => {
    const user = getUserProfile() || getCurrentUser() || {};
    return {
      name: user.name || 'CIT-U Student',
      email: user.email || 'student@cit.edu.ph',
      studentId: user.studentId || user.idNumber || '21-1234-567',
      department: user.department || 'College of Computer Studies',
      role: user.role || 'student',
      mobile: user.mobile || '+63 912 345 6789',
      campusAddress: user.campusAddress || `${user.department || 'CIT-U Main Campus'}, N. Bacalso Ave`,
      dietaryPreferences: user.dietaryPreferences || 'No specific preferences',
      status: user.status || 'Actively Enrolled',
      joined: user.joined || 'Nov 20, 2026'
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loaded = getUserProfile();
    if (loaded) {
      setProfile((prev) => ({
        ...prev,
        ...loaded,
        studentId: loaded.studentId || loaded.idNumber || prev.studentId
      }));
    }
  }, []);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    try {
      updateUserProfile(profile);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleReset = () => {
    const fresh = getUserProfile() || {};
    setProfile({
      name: fresh.name || '',
      email: fresh.email || '',
      studentId: fresh.studentId || fresh.idNumber || '',
      department: fresh.department || '',
      role: fresh.role || 'student',
      mobile: fresh.mobile || '',
      campusAddress: fresh.campusAddress || '',
      dietaryPreferences: fresh.dietaryPreferences || 'No specific preferences',
      status: fresh.status || 'Actively Enrolled',
      joined: fresh.joined || 'Nov 20, 2026'
    });
    setSavedSuccess(false);
  };

  // Helper for dynamic 2-letter avatar initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-hero">
        <div>
          <span className="profile-eyebrow">
            {profile.role === 'admin' ? 'Admin Portal Settings' : 'Account Settings'}
          </span>
          <h1 className="profile-title">Profile Settings</h1>
          <p className="profile-subtitle">
            Manage your personal credentials, contact details, and dietary kitchen notes.
          </p>
        </div>

        <div className="profile-hero-actions">
          <button type="button" onClick={handleReset} className="btn-secondary">
            Reset
          </button>
          <button type="button" onClick={handleSave} className="btn-primary">
            Save Changes ✓
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          backgroundColor: '#dcfce7',
          color: '#166534',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          border: '1px solid var(--border-green)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span> Profile settings successfully saved!
        </div>
      )}

      {/* Main Grid */}
      <div className="profile-grid">
        {/* Left Sidebar Card */}
        <aside className="profile-sidebar-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="profile-avatar-box">
              {getInitials(profile.name)}
            </div>
            <div className="profile-user-info">
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
            </div>
          </div>

          <div className="profile-meta-grid">
            <div>
              <span className="meta-item-label">Status</span>
              <p className="meta-item-val">{profile.status}</p>
            </div>
            <div>
              <span className="meta-item-label">Joined</span>
              <p className="meta-item-val">{profile.joined}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div>
              <span className="meta-item-label">
                {profile.role === 'admin' ? 'Staff / Admin ID' : 'Student / Faculty ID'}
              </span>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                {profile.studentId || profile.idNumber}
              </p>
            </div>

            <div>
              <span className="meta-item-label">Department</span>
              <p style={{ color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                {profile.department}
              </p>
            </div>

            <div>
              <span className="meta-item-label">Dietary Preferences</span>
              <p style={{ color: 'var(--primary-dark)', margin: '2px 0 0 0', fontStyle: 'italic' }}>
                "{profile.dietaryPreferences || 'No preferences specified'}"
              </p>
            </div>
          </div>
        </aside>

        {/* Right Form Card */}
        <main className="profile-form-card">
          <div>
            <h2 className="profile-section-title">Personal Information</h2>
            <p className="profile-section-subtitle">
              This information is linked to your canteen orders and receipts.
            </p>

            <div className="profile-field-row" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={handleChange('name')}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={handleChange('email')}
                  className="form-input"
                />
              </div>
            </div>

            <div className="profile-field-row" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label>
                  {profile.role === 'admin' ? 'Admin ID' : 'Student / Employee ID'}
                </label>
                <input
                  type="text"
                  value={profile.studentId}
                  onChange={handleChange('studentId')}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Mobile Contact Number</label>
                <input
                  type="tel"
                  value={profile.mobile}
                  onChange={handleChange('mobile')}
                  placeholder="+63 9XX XXX XXXX"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>College / Department / Campus Location</label>
              <input
                type="text"
                value={profile.campusAddress}
                onChange={handleChange('campusAddress')}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Dietary Preferences / Kitchen Allergy Notes</label>
              <textarea
                rows="3"
                value={profile.dietaryPreferences}
                onChange={handleChange('dietaryPreferences')}
                className="form-input"
                placeholder="e.g. Peanut allergy, less oil, vegetarian, low sodium..."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
