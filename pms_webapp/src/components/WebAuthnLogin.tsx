import React, { useState } from 'react';
import api from '../services/api';
import cbor from 'cbor-web';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '../utils/webauthnUtils';

interface WebAuthLoginProps {
  email: string;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

const WebAuthLogin: React.FC<WebAuthLoginProps> = ({ email, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  // Helper to convert Buffer or bytes to ArrayBuffer
  const toArrayBuffer = (input: any): ArrayBuffer => {
    if (input instanceof ArrayBuffer) return input;
    if (input instanceof Uint8Array) return input.buffer as ArrayBuffer;  // Type assertion
    if (input && input.type === 'Buffer' && Array.isArray(input.data)) {
      return new Uint8Array(input.data).buffer;
    }
    if (typeof input === 'string') return base64ToArrayBuffer(input);
    throw new Error('Invalid input type for conversion to ArrayBuffer');
  };

  const handleBiometricLogin = async () => {
    if (!email) {
      onError('Please enter your email');
      return;
    }
    if (!window.PublicKeyCredential) {
      onError('Biometric authentication is not supported in this browser');
      return;
    }
    setLoading(true);
    try {
      console.log('Starting WebAuthn login for email:', email);

      const response = await api.post('/webauthn/login/begin', { email }, {
        responseType: 'arraybuffer',
      });
      const loginDataCbor = await response.data;
      console.log('Received login data (CBOR):', loginDataCbor);

      const loginData = cbor.decode(loginDataCbor);
      console.log('Decoded login data:', JSON.stringify(loginData, null, 2));

      // Convert challenge to ArrayBuffer
      if (!loginData.publicKey || !loginData.publicKey.challenge) {
        throw new Error('Challenge missing in login data');
      }
      loginData.publicKey.challenge = toArrayBuffer(loginData.publicKey.challenge);

      // Convert allowCredentials IDs to ArrayBuffer
      if (loginData.publicKey.allowCredentials) {
        if (!Array.isArray(loginData.publicKey.allowCredentials)) {
          throw new Error('allowCredentials is not an array');
        }
        loginData.publicKey.allowCredentials = loginData.publicKey.allowCredentials.map((cred: any) => {
          if (!cred.id) {
            throw new Error('Credential ID missing in allowCredentials');
          }
          return {
            ...cred,
            id: toArrayBuffer(cred.id),
          };
        });
      } else {
        console.warn('No allowCredentials provided; proceeding without');
      }
      console.log('Prepared login data for navigator:', loginData);

      const assertion = (await navigator.credentials.get({ publicKey: loginData.publicKey })) as PublicKeyCredential | null;
      console.log('Assertion from navigator:', assertion);
      if (!assertion) {
        onError('No credential selected.');
        return;
      }

      const assertionResponse = assertion.response as AuthenticatorAssertionResponse;

      const loginResponse = {
        id: assertion.id,
        rawId: arrayBufferToBase64(assertion.rawId),
        type: assertion.type,
        response: {
          authenticatorData: arrayBufferToBase64(assertionResponse.authenticatorData),
          clientDataJSON: arrayBufferToBase64(assertionResponse.clientDataJSON),
          signature: arrayBufferToBase64(assertionResponse.signature),
          userHandle: assertionResponse.userHandle ? arrayBufferToBase64(assertionResponse.userHandle) : null,
        },
      };
      console.log('Login response to send:', loginResponse);

      const encodedAssertion = cbor.encode(loginResponse);
      const completeResponse = await api.post('/webauthn/login/complete', encodedAssertion, {
        headers: { 'Content-Type': 'application/cbor' },
        responseType: 'json',
      });
      console.log('Complete response:', completeResponse.data);

      const { access_token } = completeResponse.data;
      onSuccess(access_token);
    } catch (error: any) {
      console.error('Login error:', error);
      onError(
        error.message ||
        error.response?.data?.detail ||
        (error.message?.includes('No credentials registered')
          ? 'No biometric credentials found. Please set up biometrics in settings.'
          : 'Biometric login failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBiometricLogin}
      disabled={loading}
      className="w-full mt-4 bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-75"
    >
      {loading ? 'Logging in...' : 'Login with Biometrics'}
    </button>
  );
};

export default WebAuthLogin;