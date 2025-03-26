// EncryptionService.ts - Handles all encryption/decryption operations
import * as CryptoJS from 'crypto-js';

export class LocalEncryptionService {
  private masterKey: string;
  private encryptionKey: string;
  
  constructor(masterKey?: string) {
    if (masterKey) {
      this.masterKey = masterKey;
    } else {
      // Generate a new random key for new users
      const randomBytes = CryptoJS.lib.WordArray.random(32);
      this.masterKey = CryptoJS.enc.Base64.stringify(randomBytes);
    }
    
    // Derive encryption key from master key
    this.encryptionKey = this.deriveKey(this.masterKey);
  }
  
  private deriveKey(masterKey: string, salt?: string): string {
    // Use the same salt as the server for compatibility
    const keySalt = salt || 'secure_salt_for_password_manager';
    
    // PBKDF2 with same parameters as server
    const key = CryptoJS.PBKDF2(masterKey, keySalt, {
      keySize: 256/32, // 256 bits
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
    
    return CryptoJS.enc.Base64.stringify(key);
  }
  
  encryptData(data: string | Record<string, any>): string {
    // Convert object to string if needed
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encrypt using AES (comparable to Fernet in Python)
    // Using CryptoJS AES which defaults to CBC mode with PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(dataString, this.encryptionKey);
    return encrypted.toString();
  }
  
  decryptData(encryptedData: string): string | Record<string, any> {
    try {
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(decryptedString);
        return jsonData || { error: "decryption failed" };
      } catch (error) {
        // If not valid JSON, return as string
        return decryptedString || "(decryption failed)";
      }
    } catch (error) {
      console.error("Error decrypting data:", error);
      return "(decryption failed)";
    }
  }
  
  encryptVaultItem(itemData: string): string {
    return this.encryptData(itemData);
  }
  
  decryptVaultItem(encryptedData: string): Record<string, any> {
    const decryptedData = this.decryptData(encryptedData);
    if (typeof decryptedData === 'string') {
      return { value: decryptedData };
    }
    return decryptedData as Record<string, any>;
  }
  
  static generateEncryptionKeyFromPassword(masterPassword: string, salt?: string): string {
    const keySalt = salt || CryptoJS.lib.WordArray.random(16).toString();
    
    // PBKDF2 with same parameters as server
    const key = CryptoJS.PBKDF2(masterPassword, keySalt, {
      keySize: 256/32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
    
    return CryptoJS.enc.Base64.stringify(key);
  }
  
  getMasterKey(): string {
    return this.masterKey;
  }
}