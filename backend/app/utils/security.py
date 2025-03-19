# backend/app/utils/security.py

from fastapi import HTTPException

import os
import secrets
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
# Use environment variables for sensitive information
SECRET_KEY = os.getenv("JWT_SECRET_KEY") or secrets.token_hex(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Password hashing context
# Using Argon2 as primary with stronger parameters
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    default="argon2",
    argon2__time_cost=4,       # Increased from default of 2
    argon2__memory_cost=65536, # 64MB
    argon2__parallelism=4,     # Match with typical CPU cores
    argon2__hash_len=32,
    argon2__salt_len=16,
    deprecated="auto"
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify that a plaintext password matches a hashed password.
    
    Args:
        plain_password: The plaintext password to verify
        hashed_password: The hashed password to check against
        
    Returns:
        True if the password matches, False otherwise
    """
    if not plain_password or not hashed_password:
        return False
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a plaintext password using the configured hashing algorithm.
    
    Args:
        password: The plaintext password to hash
        
    Returns:
        Hashed password string
    """
    if not password:
        raise ValueError("Password cannot be empty")
    return pwd_context.hash(password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token.
    
    Args:
        data: The payload data to include in the token
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Add issued at time for token tracking
    to_encode.update({"iat": datetime.now(timezone.utc)})
    
    # Set expiration time
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Add token type to prevent confusion attacks
    to_encode.update({"type": "access"})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(user_email: str) -> str:
    """
    Create a refresh token for the specified user.
    
    Args:
        user_email: The email of the user to create a refresh token for
        
    Returns:
        Encoded JWT refresh token string
    """
    expire = datetime.now(timezone.utc)+ timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "sub": str(user_email),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    }
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """
    Verify a JWT token and return the payload if valid.
    
    Args:
        token: The JWT token to verify
        token_type: The expected token type ("access" or "refresh")
        
    Returns:
        Dictionary containing the token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Validate token type to prevent token confusion attacks
        if payload.get("type") != token_type:
            raise HTTPException(status_code=401, detail="Invalid token type")

        current_time = datetime.now(timezone.utc)
        expiration_time = datetime.fromtimestamp(payload.get("exp", 0), tz=timezone.utc)
        
        # Check if token is expired
        
        if current_time > expiration_time: 
            raise HTTPException(status_code=401, detail="Token has expired")
            
        return payload
    except JWTError:
        return None


def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify an access token and return the payload.
    
    Args:
        token: The JWT access token to verify
        
    Returns:
        Dictionary containing the token payload if valid, None otherwise
    """
    return verify_token(token, "access")


def verify_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify a refresh token and return the payload.
    
    Args:
        token: The JWT refresh token to verify
        
    Returns:
        Dictionary containing the token payload if valid, None otherwise
    """
    return verify_token(token, "refresh")


def get_token_user_id(token: str) -> Optional[str]:
    """
    Extract the user ID from a valid token.
    
    Args:
        token: The JWT token
        
    Returns:
        User ID string if token is valid, None otherwise
    """
    payload = verify_token(token)
    if payload and "sub" in payload:
        return payload["sub"]
    return None


def password_meets_requirements(password: str) -> bool:
    """
    Check if the password meets the minimum security requirements.
    
    Args:
        password: The password to check
        
    Returns:
        True if the password meets requirements, False otherwise
    """
    if not password or len(password) < 12:
        return False
        
    # Check for at least one lowercase, one uppercase, one digit, and one special character
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)
    
    return has_lower and has_upper and has_digit and has_special
