import React from 'react';

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: '#fee', color: '#900', padding: '8px', margin: '8px 0' }}>
      {message}
    </div>
  );
}

export default ErrorBanner;
