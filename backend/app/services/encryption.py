# backend/app/services/encryption.py
from cryptography.fernet import Fernet

class EncryptionService:
    def __init__(self):
        self.key = Fernet.generate_key()
        self.cipher_suite = Fernet(self.key)
    
    def encrypt_password(self, password: str) -> bytes:
        """ Encrypt plain text password """
        return self.cipher_suite.encrypt(password.encode())
    
    def decrypt_password(self, encrypted_password: bytes) -> str:
        """ Decrypt an encrypted password """
        return self.cipher_suite.decrypt(encrypted_password).decode()
