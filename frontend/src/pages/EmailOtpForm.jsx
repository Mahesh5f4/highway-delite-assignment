import React, { useState } from 'react';

function EmailOtpForm({ onOtpRequested }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'signup' })
      });
      const data = await res.json();
      if (res.ok) {
        onOtpRequested(email);
      } else {
        setError(data.message || 'Error requesting OTP');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up with Email</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit" disabled={loading}>Request OTP</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default EmailOtpForm;
