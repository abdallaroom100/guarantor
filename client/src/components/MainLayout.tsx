import React from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { label: 'إنشاء كفيل وعمال', path: '/' },
  { label: 'أوشكوا على الانتهاء', path: '/almost-expired' },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }} >
      {/* Sidebar */}
     
      {/* Main Content */}
      <div style={{ flex: 1, background: '#eaf4ff', minHeight: '100vh' }}>
        <main style={{ minHeight: '80vh' }}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout; 