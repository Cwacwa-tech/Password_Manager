// src/utils/webauthn-helpers.ts
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const binaryString = byteArray.reduce((data, byte) => 
      data + String.fromCharCode(byte), '');
    return window.btoa(binaryString);
  }
  
  export function decodeRegistrationOptions(encodedOptions: any): PublicKeyCredentialCreationOptions {
    return {
      challenge: base64ToArrayBuffer(encodedOptions.challenge),
      rp: {
        name: encodedOptions.rp.name,
        id: encodedOptions.rp.id
      },
      user: {
        id: base64ToArrayBuffer(encodedOptions.user.id),
        name: encodedOptions.user.name,
        displayName: encodedOptions.user.displayName
      },
      pubKeyCredParams: encodedOptions.pubKeyCredParams,
      timeout: 60000,
      attestation: 'direct' as AttestationConveyancePreference
    };
  }
  
  export function decodeLoginOptions(encodedOptions: any): PublicKeyCredentialRequestOptions {
    return {
      challenge: base64ToArrayBuffer(encodedOptions.challenge),
      rpId: encodedOptions.rpId,
      timeout: 60000,
      userVerification: 'preferred',
      allowCredentials: encodedOptions.allowCredentials.map((cred: any) => ({
        type: 'public-key' as const,
        id: base64ToArrayBuffer(cred.id)
      }))
    };
  }