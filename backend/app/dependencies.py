# backend/app/dependencies.py
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from redis import Redis
import os

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models import User, VaultEntry
from app.utils.security import verify_access_token

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
    user_id = payload.get("sub")
    user = db.query(User).filter(User.email == VaultEntry.user_email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user