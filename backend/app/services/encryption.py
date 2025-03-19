# backend/app/services/encryption.py

from app.models import User

import base64
import json
import os
from typing import Dict, Any, Union
import binascii

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class EncryptionService:
    def __init__(self, master_key: str = None):
        """
        Initialize the encryption service with a master key.
        If no master key is provided, a new one will be generated.
        
        For a password manager, the master key should be derived from the user's master password.
        """
        
        if master_key:
            # Use the provided master key
            self.master_key = master_key
        else:
            # Generate a new master key (this should only be done during user creation)
            self.master_key = base64.urlsafe_b64encode(os.urandom(32)).decode()
        
        # Derive an encryption key from the master key
        self.encryption_key = self._derive_key(self.master_key)
        self.cipher_suite = Fernet(self.encryption_key)
    
    def _derive_key(self, master_key: str, salt: bytes = None) -> bytes:
        """
        Derive an encryption key from the master key using PBKDF2.
        This improves security by adding computational difficulty to brute force attempts.
        """
        if salt is None:
            # In production, salt should be stored per user and retrieved from database
            # For simplicity, using a fixed salt here, but this should be unique per user
            salt = b'secure_salt_for_password_manager'  # Should be stored securely per user
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(master_key.encode()))
        return key
    
    def encrypt_data(self, data: Union[str, Dict[str, Any]]) -> str:
        """
        Encrypt data (string or dictionary) and return it as a string.
        For dictionary data, it will be converted to JSON first.
        """
        if isinstance(data, dict):
            data_str = json.dumps(data)
        else:
            data_str = str(data)
        
        encrypted_data = self.cipher_suite.encrypt(data_str.encode())
        return base64.urlsafe_b64encode(encrypted_data).decode()
    
    
    def decrypt_data(self, encrypted_data: str) -> Union[str, Dict[str, Any]]:
        """
        Decrypt encrypted data and return it.
        If the decrypted data is valid JSON, it will be parsed and returned as a dictionary.
        """
        try:
            decoded_data = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher_suite.decrypt(decoded_data).decode()
            
            # Try to parse as JSON
            try:
                json_data = json.loads(decrypted_data)
                return json_data if json_data else "(decryption failed)"

            except json.JSONDecodeError:
                # If not valid JSON, return as string
                return decrypted_data if decrypted_data else "(decryption failed)"
                
        except Exception as e:
            print(f"Error decrypting data: {str(e)}")  # Log the error
        return "(decryption failed)"  # Ensure a valid return value
    
    
    def encrypt_vault_item(self, item_data: Dict[str, Any]) -> str:
        """
        Encrypt a vault item's sensitive data.
        For a password manager, this would include passwords, card numbers, notes, etc.
        """
        return self.encrypt_data(item_data)
    
    def decrypt_vault_item(self, encrypted_data: str) -> Dict[str, Any]:
        """
        Decrypt a vault item's sensitive data.
        """
        decrypted_data = self.decrypt_data(encrypted_data)
        if isinstance(decrypted_data, str):
            # If somehow the data wasn't stored as JSON
            return {"value": decrypted_data}
        return decrypted_data
    
    @staticmethod
    def generate_encryption_key_from_password(master_password: str, salt: bytes = None) -> bytes:
        """
        Generate a master encryption key from a user's master password.
        This should be done when a user first sets up their account.
        
        The resulting key should be stored securely and associated with the user's account,
        but the master password itself should never be stored.
        """
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(master_password.encode()))
        
        # In a real implementation, you would also return or store the salt
        # since it's needed to regenerate the same key later
        return key
