from sqlalchemy import Column, Integer, String, LargeBinary, DateTime, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)  # Added primary key
    email = Column(String, unique=True, index=True)
    username = Column(String, nullable=False, unique=True)
    master_password_hash = Column(String)
    totp_secret = Column(String)
    biometric_data = Column(LargeBinary, nullable=True)  # Make nullable if it's optional
    vault_entries = relationship("VaultEntry", back_populates="owner")
    shared_entries = relationship("SharedUser", back_populates="shared_with")

class VaultEntry(Base):
    __tablename__ = "vault_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("users.email"), index=True)
    site = Column(String)
    username = Column(String)
    encrypted_password = Column(LargeBinary)
    last_modified = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)  # Automatically update on change
    owner = relationship("User", back_populates="vault_entries")
    shared_users = relationship("SharedUser", back_populates="vault_entry")

class SharedUser(Base):
    __tablename__ = "shared_users"
    
    id = Column(Integer, primary_key=True, index=True)
    vault_entry_id = Column(Integer, ForeignKey('vault_entries.id'), nullable=False)
    user_email = Column(String, ForeignKey('users.email'), nullable=False)
    shared_with = relationship("User", back_populates="shared_entries")
    vault_entry = relationship("VaultEntry", back_populates="shared_users")
