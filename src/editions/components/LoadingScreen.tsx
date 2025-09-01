import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div id="edition-loading-screen">
      <div className="edition-loader"></div>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '18px' }}>Loading...</p>
    </div>
  );
};

export default LoadingScreen;