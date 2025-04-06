// File: src/utils/webauthnUtils.ts
export function base64ToArrayBuffer(base64: string | Uint8Array | ArrayBuffer): ArrayBuffer {
  if (base64 instanceof Uint8Array) {
    return base64.buffer as ArrayBuffer;  // Type assertion
  }
  if (base64 instanceof ArrayBuffer) {
    return base64;
  }
  // Assume it's a base64 string
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    console.error('Failed to decode base64:', base64, e);
    throw e;
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}