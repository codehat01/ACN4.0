import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div id="loading-screen">
      <div className="loader"></div>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '18px' }}>Loading...</p>
    </div>
  );
};

export default LoadingScreen;