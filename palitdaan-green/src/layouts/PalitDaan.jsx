import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MainContent from './MainContent';

export default function PalitDaan() {
  // On tablet / landscape screens default open, can toggle anytime
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
        overflowX: 'hidden'
      }}
    >
      <Navbar toggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 66px)', position: 'relative' }}>
        {isSidebarOpen && <Sidebar onClose={() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }} />}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', boxSizing: 'border-box' }}>
          <MainContent />
        </div>
      </div>
    </div>
  );
}
