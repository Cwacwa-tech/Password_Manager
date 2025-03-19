# backend/app/services/authentication.py

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import secrets
import string
import uuid
import os
import base64
from jose import jwt
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from passlib.hash import argon2
import pyotp
from fido2.server import Fido2Server
from fido2.webauthn import PublicKeyCredentialRpEntity

from app.models import User, UserDevice, LoginAttempt, RecoveryCode
from app.schemas import UserCreate, UserLogin, TokenData
from app.services.encryption import EncryptionService

class AuthenticationService:
    def __init__(self, db: Session):
        self.db = db
        self.secret_key = os.environ.get("SECRET_KEY", "insecure-secret-key-replace-in-production")
        self.algorithm = os.environ.get("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

        # Setup for WebAuthn (FIDO2) authentication
        self.rp = PublicKeyCredentialRpEntity(
            id=os.environ.get("DOMAIN_NAME", "localhost"),
            name="Password Manager"
        )
        self.fido_server = Fido2Server(self.rp)

    def create_user(self, user: UserCreate) -> User:
        """
        Create a new user with a hashed master password and TOTP secret
        """
        # Check if email or username already exists
        existing_user = self.db.query(User).filter(
            (User.email == user.email) | (User.username == user.username)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or username already registered"
            )
        
        # Hash the master password using Argon2
        hashed_password = argon2.hash(user.master_password)
        
        # Generate TOTP secret for two-factor authentication
        totp_secret = pyotp.random_base32()
        
        # Generate a salt for key derivation
        key_derivation_salt = secrets.token_bytes(16)
        
        # Convert key_derivation_salt to a Base64-encoded string for storage
        # key_derivation_salt_str = base64.b64encode(key_derivation_salt).decode()

        # Generate an encryption key from the master password
        encryption_key = EncryptionService.generate_encryption_key_from_password(
            user.master_password, 
            key_derivation_salt
        )
        
        # Generate recovery codes
        recovery_codes = self._generate_recovery_codes(10)
        
        try:
            # Create the user
            db_user = User(
                username=user.username,
                email=user.email,
                master_password_hash=hashed_password,
                totp_secret=totp_secret,
                key_derivation_salt=key_derivation_salt,
                encryption_key=encryption_key,  # Store this securely!
                is_totp_enabled=False,  # User needs to confirm TOTP setup
                is_active=True,
                created_at=datetime.now(timezone.utc),
                last_login=None
            )
            
            self.db.add(db_user)
            self.db.flush()  # Flush to get the user ID
            
            # Store recovery codes
            for code in recovery_codes:
                hashed_code = argon2.hash(code["code"])
                recovery = RecoveryCode(
                    user_email=db_user.email,
                    code=hashed_code,
                    is_used=False,
                    created_at=datetime.now(timezone.utc),
                    expires_at=datetime.now(timezone.utc) + timedelta(days=30)  # Adjust the expiration as needed
                )
                self.db.add(recovery)
            
            self.db.commit()
            self.db.refresh(db_user)
            
            # Return the user with plain text recovery codes (only time they're available)
            return {
                "user": db_user,
                "recovery_codes": [code["code"] for code in recovery_codes],
                "totp_secret": totp_secret  # Return this for QR code generation
            }
            
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database error during user creation"
            )

    def verify_user(self, user_login: UserLogin) -> User:
        """
        Verify user credentials without creating a token
        """
        user = self.db.query(User).filter(User.email == user_login.email).first()
        
        if not user or not argon2.verify(user_login.password, user.master_password_hash):
            # Record failed login attempt
            self._record_login_attempt(user.email if user else None, False, user_login.ip_address)
            
            # Check if there are too many failed attempts
            if user and self._check_for_brute_force(user.email, user_login.ip_address):
                # Lock the account temporarily
                user.is_active = False
                self.db.commit()
                
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Record successful login attempt
        self._record_login_attempt(user.email, True, user_login.ip_address)
        
        return user

    def authenticate_user(self, user_login: UserLogin) -> Dict[str, Any]:
        """
        Authenticate user and create access token
        """
        user = self.verify_user(user_login)
        
        # If TOTP is enabled, don't create token yet - request TOTP code
        if user.is_totp_enabled:
            return {
                "requires_totp": True,
                "user_email": user.email,
                "message": "TOTP code required"
            }
        
        # Update last login time
        user.last_login = datetime.now(timezone.utc)
        self.db.commit()
        
        # Create access token
        access_token = self.create_access_token(
            data={"sub": user.email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_email": user.email,
            "requires_totp": False
        }

    def verify_totp(self, user_email: str, totp_code: str) -> Dict[str, Any]:
        """
        Verify TOTP code and create access token if valid
        """
        user = self.db.query(User).filter(User.email == user_email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        totp = pyotp.TOTP(user.totp_secret)
        
        if not totp.verify(totp_code):
            # Record failed verification
            self._record_login_attempt(user.email, False, None, "totp_failure")
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid TOTP code"
            )
        
        # Update last login time
        user.last_login = datetime.now(timezone.utc)
        self.db.commit()
        
        # Create access token
        access_token = self.create_access_token(
            data={"sub": user.email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_email": user.email
        }

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create JWT access token
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire_minutes)
            
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def setup_totp(self, user_email: str) -> Dict[str, str]:
        """
        Enable TOTP for a user and return the secret for QR code generation
        """
        user = self.db.query(User).filter(User.email == user_email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate new TOTP secret if needed
        if not user.totp_secret:
            user.totp_secret = pyotp.random_base32()
            self.db.commit()
        
        # Return the TOTP secret and a provisioning URI for QR codes
        totp = pyotp.TOTP(user.totp_secret)
        provisioning_uri = totp.provisioning_uri(
            name=user.email,
            issuer_name="Password Manager"
        )
        
        return {
            "totp_secret": user.totp_secret,
            "provisioning_uri": provisioning_uri
        }

    def confirm_totp_setup(self, user_email: str, totp_code: str) -> Dict[str, Any]:
        """
        Confirm TOTP setup by verifying the user can generate valid codes
        """
        user = self.db.query(User).filter(User.email == user_email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        totp = pyotp.TOTP(user.totp_secret)
        
        if not totp.verify(totp_code):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid TOTP code"
            )
        
        # Enable TOTP for the user
        user.is_totp_enabled = True
        self.db.commit()
        
        return {"message": "TOTP setup completed successfully"}

    def register_device(self, user_email: str, device_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Register a new device for a user
        """
        user = self.db.query(User).filter(User.email == user_email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        device_id = str(uuid.uuid4())
        
        new_device = UserDevice(
            user_email=user_email,
            device_id=device_id,
            device_name=device_info.get("device_name", "Unknown device"),
            device_type=device_info.get("device_type", "browser"),
            is_trusted=False,  # New devices start as untrusted
            created_at=datetime.now(timezone.utc),
            last_seen_at=datetime.now(timezone.utc)
        )
        
        self.db.add(new_device)
        self.db.commit()
        
        return {
            "device_id": device_id,
            "message": "Device registered successfully"
        }

    def verify_recovery_code(self, email: str, recovery_code: str) -> Dict[str, Any]:
        """
        Verify a recovery code for account recovery
        """
        user = self.db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check all recovery codes
        recovery_codes = self.db.query(RecoveryCode).filter(
            RecoveryCode.user_email == user.email,
            RecoveryCode.is_used == False
        ).all()
        
        for code in recovery_codes:
            if argon2.verify(recovery_code, code.code):
                # Mark code as used
                code.is_used = True
                code.used_at = datetime.now(timezone.utc)
                self.db.commit()
                
                # Generate a password reset token
                reset_token = self.create_access_token(
                    data={"sub": user.email, "type": "reset"},
                    expires_delta=timedelta(hours=1)
                )
                
                return {
                    "reset_token": reset_token,
                    "message": "Recovery code accepted. You can now reset your password."
                }
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid recovery code"
        )

    def reset_password(self, reset_token: str, new_password: str) -> Dict[str, str]:
        """
        Reset password using a reset token
        """
        try:
            # Decode token
            payload = jwt.decode(reset_token, self.secret_key, algorithms=[self.algorithm])
            email = payload.get("sub")
            token_type = payload.get("type")
            
            if not email or token_type != "reset":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid reset token"
                )
                
            user = self.db.query(User).filter(User.email == email).first()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Hash new password
            hashed_password = argon2.hash(new_password)
            
            # Generate new encryption key from the new password
            key_derivation_salt = secrets.token_bytes(16)
            encryption_key = EncryptionService.generate_encryption_key_from_password(
                new_password, 
                key_derivation_salt
            )
            
            # Update user password and related fields
            user.master_password_hash = hashed_password
            user.key_derivation_salt = key_derivation_salt
            user.encryption_key = encryption_key
            user.password_updated_at = datetime.now(timezone.utc)
            
            # Generate new recovery codes
            recovery_codes = self._generate_recovery_codes(10)
            
            # Mark all existing recovery codes as used
            existing_codes = self.db.query(RecoveryCode).filter(
                RecoveryCode.user_email == user.email
            ).all()
            
            for code in existing_codes:
                code.is_used = True
                code.used_at = datetime.now(timezone.utc)
            
            # Add new recovery codes
            for code in recovery_codes:
                hashed_code = argon2.hash(code["code"])
                recovery = RecoveryCode(
                    user_email=user.email,
                    code=hashed_code,
                    is_used=False
                )
                self.db.add(recovery)
            
            self.db.commit()
            
            return {
                "message": "Password reset successfully",
                "recovery_codes": [code["code"] for code in recovery_codes]
            }
            
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid reset token"
            )

    def _generate_recovery_codes(self, count: int = 10) -> list:
        """
        Generate a list of recovery codes
        """
        codes = []
        for _ in range(count):
            # Generate a random code (easier to type than UUID)
            code_chars = string.ascii_uppercase + string.digits
            code_chars = code_chars.replace("O", "").replace("0", "").replace("I", "").replace("1", "")  # Remove ambiguous characters
            code = ''.join(secrets.choice(code_chars) for _ in range(10))
            
            # Add dashes for readability
            formatted_code = '-'.join([code[i:i+5] for i in range(0, len(code), 5)])
            
            codes.append({
                "code": formatted_code,
                "created_at": datetime.now(timezone.utc)
            })
            
        return codes

    def _record_login_attempt(self, user_email: Optional[str], success: bool, 
                            ip_address: Optional[str], attempt_type: str = "password") -> None:
        """
        Record a login attempt for security monitoring
        """
        login_attempt = LoginAttempt(
            user_email=user_email,
            ip_address=ip_address,
            status="SUCCESS" if success else "FAILED",
            method=attempt_type,
            attempted_at=datetime.now(timezone.utc)
        )
        
        self.db.add(login_attempt)
        self.db.commit()

    def _check_for_brute_force(self, user_email: str, ip_address: Optional[str]) -> bool:
        """
        Check if there are signs of a brute force attack
        """
        # Check for too many failed attempts in the last hour
        one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
        
        # Count failed attempts for this user
        user_attempts = self.db.query(LoginAttempt).filter(
            LoginAttempt.user_email == user_email,
            LoginAttempt.success == False,
            LoginAttempt.timestamp > one_hour_ago
        ).count()
        
        # Count failed attempts from this IP
        ip_attempts = 0
        if ip_address:
            ip_attempts = self.db.query(LoginAttempt).filter(
                LoginAttempt.ip_address == ip_address,
                LoginAttempt.success == False,
                LoginAttempt.timestamp > one_hour_ago
            ).count()
        
        # Return True if either threshold is exceeded
        return user_attempts >= 5 or ip_attempts >= 10

    def get_webauthn_registration_options(self, user_email: str) -> Dict[str, Any]:
        """
        Get WebAuthn registration options for adding a security key
        """
        user = self.db.query(User).filter(User.email == user_email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        registration_data, state = self.fido_server.register_begin(
            {
                "id": str(user.email).encode(),
                "name": user.username,
                "displayName": user.email
            },
            user_verification="preferred"
        )
        
        # Store registration state in Redis or the database
        # For simplicity, here we'd return it to be stored client-side temporarily
        # In production, use a more secure storage method
        
        return {
                "registration_options": registration_data,
                "state": state
            }
