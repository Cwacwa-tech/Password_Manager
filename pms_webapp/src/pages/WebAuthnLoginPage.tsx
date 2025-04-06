// File: src/pages/WebAuthnLoginPage.tsx
import React, { useState } from 'react';
import WebAuthLogin from '../components/WebAuthnLogin';
import { useNavigate } from 'react-router-dom';

const WebAuthnLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSuccess = (token: string) => {
    localStorage.setItem('accessToken', token);
    navigate('/dashboard');
  };

  const handleError = (error: string) => {
    console.error('Login Error:', error);
    // Optionally, add UI feedback for the user here (e.g., an error message)
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">WebAuthn Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 mb-4 border rounded"
      />
      <WebAuthLogin
        email={email}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default WebAuthnLoginPage;