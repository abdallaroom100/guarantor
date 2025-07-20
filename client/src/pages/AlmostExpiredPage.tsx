import React from 'react';
import MainLayout from '../components/MainLayout';

const AlmostExpiredPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container">
        <div className="section-title">أوشكوا على الانتهاء</div>
        <p>هذه الصفحة مخصصة للعمال أو الكفلاء الذين أوشكوا على الانتهاء.</p>
      </div>
    </MainLayout>
  );
};

export default AlmostExpiredPage; 