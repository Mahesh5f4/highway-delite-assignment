import React from 'react';

function GoogleSignInButton({ onSuccess }) {
  const handleGoogleSignIn = async () => {
    // TODO: Integrate Google Sign-In SDK
    // For now, simulate with a dummy idToken
    const idToken = 'dummy-google-id-token';
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      onSuccess(data.user);
    } else {
      alert(data.message || 'Google sign-in failed');
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}

export default GoogleSignInButton;
