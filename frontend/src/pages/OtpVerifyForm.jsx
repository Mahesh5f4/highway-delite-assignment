import React, { useState } from 'react';

function OtpVerifyForm({ email, onVerified }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, purpose: 'signup' })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        onVerified(data.user);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify OTP</h2>
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Enter OTP"
        required
        maxLength={6}
      />
      <button type="submit" disabled={loading}>Verify</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default OtpVerifyForm;
