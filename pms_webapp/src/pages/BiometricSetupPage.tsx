// File: src/pages/BiometricSetupPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming you have an API service for server communication
import cbor from 'cbor-web'; // For encoding/decoding CBOR data
import { base64ToArrayBuffer, arrayBufferToBase64 } from '../utils/webauthnUtils'; // Utility functions

export const BiometricSetupPage: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkWebAuthnSupport = async () => {
      if (!window.PublicKeyCredential) {
        setError('WebAuthn is not supported in this browser');
        return;
      }
      setIsSupported(true);
    };

    checkWebAuthnSupport();
  }, []);

  const handleBiometricRegistration = async () => {
    if (!user?.email) {
      setError('User email is required');
      return;
    }

    try {
      // Step 1: Fetch registration options from the server
      const response = await api.post('/webauthn/register/begin', {
        email: user.email,
      });
      const registrationDataCbor = await response.data;
      const registrationData = cbor.decode(registrationDataCbor);

      // Convert base64-encoded fields to ArrayBuffer
      registrationData.challenge = base64ToArrayBuffer(registrationData.challenge);
      registrationData.user.id = base64ToArrayBuffer(registrationData.user.id);
      if (registrationData.excludeCredentials) {
        registrationData.excludeCredentials = registrationData.excludeCredentials.map((cred: any) => ({
          ...cred,
          id: base64ToArrayBuffer(cred.id),
        }));
      }

      // Step 2: Create the credential
      const credential = (await navigator.credentials.create({
        publicKey: registrationData,
      })) as PublicKeyCredential | null;

      if (!credential) {
        setError('Credential creation was cancelled.');
        return;
      }

      // Step 3: Prepare the credential response for the server
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;
      const credentialResponse = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64(attestationResponse.attestationObject),
          clientDataJSON: arrayBufferToBase64(attestationResponse.clientDataJSON),
        },
      };

      // Step 4: Send the credential to the server to complete registration
      const encodedCredential = cbor.encode(credentialResponse);
      await api.post('/webauthn/register/complete', encodedCredential, {
        headers: { 'Content-Type': 'application/cbor' },
      });

      // Step 5: Show success and redirect
      setSuccess('Biometric authentication set up successfully!');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Biometric setup failed');
    }
  };

  const renderBiometricOptions = () => {
    if (!isSupported) {
      return (
        <div className="alert alert-warning">
          WebAuthn is not supported on this device/browser.
        </div>
      );
    }

    return (
      <div className="biometric-setup">
        <h2>Set Up Biometric Authentication</h2>
        <p>Choose your preferred authentication method:</p>

        <div className="authentication-methods">
          <button
            onClick={handleBiometricRegistration}
            className="btn btn-primary w-full mb-4"
          >
            Register Biometric Authentication
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Supported methods may include:
              <br />• Fingerprint
              <br />• Face Recognition
              <br />• Security Key
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      {renderBiometricOptions()}
    </div>
  );
};