interface PublicKeyCredential extends Credential {
    rawId: ArrayBuffer;
    response: AuthenticatorAssertionResponse;
    getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
  }
  
  interface AuthenticatorAssertionResponse {
    authenticatorData: ArrayBuffer;
    clientDataJSON: ArrayBuffer;
    signature: ArrayBuffer;
    userHandle?: ArrayBuffer | null;
  }
  
  interface CredentialRequestOptions {
    publicKey: PublicKeyCredentialRequestOptions;
  }
  
  interface Navigator {
    credentials: {
      get(options?: CredentialRequestOptions): Promise<Credential | null>;
    };
  }