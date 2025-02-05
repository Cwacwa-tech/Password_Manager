# backend/app/models.py
from sqlalchemy import Column, Integer, String, LargeBinary, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, unique=True, index=True)
    master_password_hash = Column(String)
    totp_secret = Column(String)
    biometric_data = Column(LargeBinary)

class VaultEntry(Base):
    __tablename__ = "vault_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("users.email"), index=True)
    site = Column(String)
    username = Column(String)
    encrypted_password = Column(LargeBinary)
    last_modified = Column(DateTime, default=datetime.datetime.utcnow)
