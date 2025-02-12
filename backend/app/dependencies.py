# backend/app/dependencies.py
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from redis import Redis
import os
from typing import Optional

from fastapi import Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models import User, VaultEntry
from app.utils.security import verify_access_token

import secrets
import string
import json


from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

#SECRET_KEY = os.getenv("SECRET_KEY")

DATABASE_URL =os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

redis_client = Redis(host='redis', port=6379, db=0)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    email = payload.get("sub")

    # Retrieve session from Redis
    session_data = redis_client.get(f"session:{email}")
    if not session_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session not found")


    session = json.loads(session_data)

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def get_redis():
    return redis_client

#def generate_password(length: int = 16) -> str:
#    """Generate a secure password."""
#    characters = string.ascii_uppercase + string.ascii_lowercase + string.digits + string.punctuation
#    password = ''.join(secrets.choice(characters) for _ in range(length))
#    return password

#def get_password(length: int = 16) -> str:
#    """API endpoint to generate a password internally."""
#    password = generate_password(length)
#    return {"password is ": password}