# backend/app/services/authentication.py
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate
from passlib.hash import argon2
import pyotp

class AuthenticationService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: UserCreate):
        hashed_password = argon2.hash(user.master_password)
        totp_secret = pyotp.random_base32()
        db_user = User(
            username=user.username,
            email=user.email,
            master_password_hash=hashed_password,
            totp_secret=totp_secret
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    # Additional methods for authentication, TOTP verification, biometric registration, etc.
