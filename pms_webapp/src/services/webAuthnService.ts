// src/services/webauthnService.ts
import axios from 'axios';
import { 
  arrayBufferToBase64, 
  //base64ToArrayBuffer, 
  decodeRegistrationOptions, 
  decodeLoginOptions 
} from '../utils/webauthn-helpers';

interface WebAuthnRegistrationResponse {
  status: string;
}

interface WebAuthnLoginResponse {
  access_token: string;
  token_type: string;
}

export const WebAuthnService = {
  async startRegistration(email: string): Promise<PublicKeyCredentialCreationOptions> {
    try {
      const response = await axios.post('/api/webauthn/register/begin', {
        username: email
      });
      
      // Explicitly type cast and modify the options
      const options = decodeRegistrationOptions(response.data);
      return {
        ...options,
        attestation: options.attestation as AttestationConveyancePreference
      };
    } catch (error) {
      console.error('Registration start error:', error);
      throw error;
    }
  },

  async completeRegistration(credential: PublicKeyCredential): Promise<WebAuthnRegistrationResponse> {
    try {
      const attestationResponse = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64(
            (credential.response as AuthenticatorAttestationResponse).attestationObject
          ),
          clientDataJSON: arrayBufferToBase64(
            (credential.response as AuthenticatorAttestationResponse).clientDataJSON
          )
        }
      };

      const response = await axios.post('/api/webauthn/register/complete', attestationResponse);
      return response.data;
    } catch (error) {
      console.error('Registration complete error:', error);
      throw error;
    }
  },

  async startLogin(email: string): Promise<PublicKeyCredentialRequestOptions> {
    try {
      const response = await axios.post('/api/webauthn/login/begin', { email });
      
      // Explicitly type cast and modify the options
      const options = decodeLoginOptions(response.data);
      return {
        ...options,
        allowCredentials: options.allowCredentials?.map(cred => ({
          type: 'public-key' as const,
          id: cred.id
        }))
      };
    } catch (error) {
      console.error('Login start error:', error);
      throw error;
    }
  },

  async completeLogin(credential: PublicKeyCredential): Promise<WebAuthnLoginResponse> {
    try {
      const assertionResponse = {
        id: credential.id,
        rawId: arrayBufferToBase64(credential.rawId),
        type: credential.type,
        response: {
          authenticatorData: arrayBufferToBase64(
            (credential.response as AuthenticatorAssertionResponse).authenticatorData
          ),
          clientDataJSON: arrayBufferToBase64(
            (credential.response as AuthenticatorAssertionResponse).clientDataJSON
          ),
          signature: arrayBufferToBase64(
            (credential.response as AuthenticatorAssertionResponse).signature
          ),
          userHandle: arrayBufferToBase64(
            (credential.response as AuthenticatorAssertionResponse).userHandle || new ArrayBuffer(0)
          )
        }
      };

      const response = await axios.post('/api/webauthn/login/complete', assertionResponse);
      return response.data;
    } catch (error) {
      console.error('Login complete error:', error);
      throw error;
    }
  }
};
