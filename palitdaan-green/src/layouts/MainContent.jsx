import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MenuPage from '../pages/MenuPage';
import SpecialInstructions from '../pages/SpecialInstructions';
import Cart from '../pages/Cart';
import PendingOrders from '../pages/PendingOrders';
import OrderHistory from '../pages/OrderHistory';
import ProfileSettings from '../pages/ProfileSettings';
import AdminDashboard from '../pages/AdminDashboard';

export default function MainContent() {
  return (
    <div className="fade-in" style={{ width: '100%', minHeight: '100%' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/special-instructions" element={<SpecialInstructions />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/pendingorders" element={<PendingOrders />} />
        <Route path="/orders" element={<PendingOrders />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/profilesettings" element={<ProfileSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}
