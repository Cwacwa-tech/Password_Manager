// File: src/components/WebAuthnRegistration.tsx
import React, { useState } from 'react';
import api from '../services/api';
import cbor from 'cbor-web';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '../utils/webauthnUtils';
import { useNavigate } from 'react-router-dom';

interface PublicKeyCredential extends Credential {
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse;
  type: string;
}

interface AuthenticatorAttestationResponse {
  clientDataJSON: ArrayBuffer;
  attestationObject: ArrayBuffer;
}

const WebAuthnRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAddWebAuthn = async () => {
    if (!window.PublicKeyCredential) {
      setError('Biometric authentication is not supported in this browser');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Starting WebAuthn registration...');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }
      console.log('Using token:', token);

      // Fetch registration data
      const response = await api.post('/webauthn/register/begin', null, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      });
      console.log('Received response from /register/begin:', response);
      const registrationDataCbor = response.data;
      let registrationData = cbor.decode(registrationDataCbor);
      console.log('Raw decoded registration data:', registrationData);

      // Handle wrapped publicKey structure
      if (registrationData.publicKey) {
        console.log('Adjusting for wrapped publicKey structure');
        registrationData = registrationData.publicKey;
      }

      console.log('Adjusted registration data:', registrationData);
      console.log('RP ID:', registrationData.rp.id);
      console.log('Current domain:', window.location.hostname);
      console.log('Challenge type:', typeof registrationData.challenge, registrationData.challenge);
      console.log('User type:', typeof registrationData.user, registrationData.user);
      console.log('User ID length:', registrationData.user.id instanceof Uint8Array ? registrationData.user.id.length : registrationData.user.id.byteLength);

      // Validate required fields
      if (!registrationData.challenge) {
        throw new Error('Missing challenge in registration data');
      }
      if (!registrationData.user || !registrationData.user.id) {
        throw new Error('Missing user or user.id in registration data');
      }

      // Convert challenge and user.id correctly
      registrationData.challenge = registrationData.challenge instanceof Uint8Array
        ? registrationData.challenge
        : typeof registrationData.challenge === 'string'
        ? base64ToArrayBuffer(registrationData.challenge)
        : registrationData.challenge;
      registrationData.user.id = registrationData.user.id instanceof Uint8Array
        ? registrationData.user.id
        : typeof registrationData.user.id === 'string'
        ? base64ToArrayBuffer(registrationData.user.id)
        : registrationData.user.id;
      if (registrationData.excludeCredentials) {
        registrationData.excludeCredentials = registrationData.excludeCredentials.map((cred: any) => ({
          ...cred,
          id: cred.id instanceof Uint8Array ? cred.id : typeof cred.id === 'string' ? base64ToArrayBuffer(cred.id) : cred.id,
        }));
      }

      const challengeLength = registrationData.challenge instanceof Uint8Array ? registrationData.challenge.length : registrationData.challenge.byteLength;
      const userIdLength = registrationData.user.id instanceof Uint8Array ? registrationData.user.id.length : registrationData.user.id.byteLength;
      console.log('Processed registration data:', registrationData);
      console.log('Challenge length:', challengeLength);
      console.log('User ID length:', userIdLength);
      console.log('Challenge is ArrayBuffer or Uint8Array:', registrationData.challenge instanceof ArrayBuffer || registrationData.challenge instanceof Uint8Array);
      console.log('User ID is ArrayBuffer or Uint8Array:', registrationData.user.id instanceof ArrayBuffer || registrationData.user.id instanceof Uint8Array);

      if (userIdLength > 64) {
        throw new Error(`User ID exceeds 64 bytes: ${userIdLength}`);
      }

      // Create credential
      console.log('Calling navigator.credentials.create with:', registrationData);
      const credential = await navigator.credentials.create({
        publicKey: registrationData,
      }) as PublicKeyCredential | null;

      if (!credential) {
        setError('Credential creation was cancelled.');
        setLoading(false);
        return;
      }

      console.log('Created credential:', credential);
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;

      // Prepare credential response for server
      const credentialResponse = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64(attestationResponse.attestationObject),
          clientDataJSON: arrayBufferToBase64(attestationResponse.clientDataJSON),
        },
      };

      // Complete registration
      console.log('Sending credential to /register/complete:', credentialResponse);
      const encodedCredential = cbor.encode(credentialResponse);
      const completeResponse = await api.post('/webauthn/register/complete', encodedCredential, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/cbor' 
        },
        responseType: 'json',
      });
      console.log('Received response from /register/complete:', completeResponse);

      setSuccess('Biometric authentication added successfully!');
    } catch (err: any) {
      console.error('Error in WebAuthn registration:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to set up biometric authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      <button
        onClick={handleAddWebAuthn}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
      >
        {loading ? 'Setting up...' : 'Add Biometric Authentication'}
      </button>
    </div>
  );
};

export default WebAuthnRegistration;