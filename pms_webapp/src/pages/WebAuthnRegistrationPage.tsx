// File: src/pages/WebAuthnRegistrationPage.tsx
import React from 'react';
import WebAuthnRegistration from '../components/WebAuthnRegistration';

const WebAuthnRegistrationPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">WebAuthn Registration</h2>
      <WebAuthnRegistration />
    </div>
  );
};

export default WebAuthnRegistrationPage;