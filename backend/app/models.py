from sqlalchemy import Column, Integer, String, LargeBinary, DateTime, ForeignKey, Table, Boolean, Enum, Text, func, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, INET
from datetime import datetime, timezone
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)  # Primary key
    email = Column(String, unique=True, index=True)
    username = Column(String, nullable=False, unique=True)
    master_password_hash = Column(String)
    totp_secret = Column(String)
    biometric_data = Column(LargeBinary, nullable=True)  # Make nullable if it's optional
    key_derivation_salt = Column(LargeBinary, nullable=False)
    encryption_key = Column(LargeBinary, nullable=True)
    is_totp_enabled = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_locked = Column(Boolean, default=False)
    locked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    last_login = Column(DateTime, nullable=True)
    password_updated_at = Column(DateTime, nullable=True)

    vault_entries = relationship("VaultEntry", back_populates="owner",  cascade="all, delete")
    shared_entries = relationship("SharedUser", back_populates="shared_with",  cascade="all, delete")
    sync_metadata = relationship('SyncMetadata', back_populates='user',  cascade="all, delete")
    devices = relationship("UserDevice", back_populates="user", cascade="all, delete-orphan")
    login_attempts = relationship("LoginAttempt", back_populates="user", cascade="all, delete-orphan")
    recovery_codes = relationship("RecoveryCode", back_populates="user", cascade="all, delete-orphan")
    webauthn_credentials = relationship("WebAuthnCredential", back_populates="user", cascade="all, delete-orphan")

class VaultEntry(Base):
    __tablename__ = "vault_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("users.email"), index=True)
    site = Column(String)
    username = Column(String)
    encrypted_password = Column(String)
    last_modified = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))  # Automatically update on change
    last_modified_by = Column(String)  # This is the device_id that made the last modification
    deleted = Column(Boolean, default=False)  # Adding the deleted field referenced in get_changes_since_last_sync
    version = Column(Integer, default=1)  # Adding the version field referenced in get_changes_since_last_sync
    
    __table_args__ = (UniqueConstraint('user_email', 'site', name='_user_site_uc'),)

    owner = relationship("User", back_populates="vault_entries")
    shared_users = relationship("SharedUser", back_populates="vault_entry",  cascade="all, delete")

class SharedUser(Base):
    __tablename__ = "shared_users"
    
    id = Column(Integer, primary_key=True, index=True)
    vault_entry_id = Column(Integer, ForeignKey('vault_entries.id'), nullable=False)
    user_email = Column(String, ForeignKey('users.email'), nullable=False)
    
    shared_with = relationship("User", back_populates="shared_entries")
    vault_entry = relationship("VaultEntry", back_populates="shared_users")

class SyncMetadata(Base):
    __tablename__ = "sync_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, ForeignKey("users.email"), nullable=False)
    device_id = Column(String, nullable=False)  # Unique identifier for each device
    last_sync = Column(DateTime, default=datetime.now(timezone.utc))
    sync_token = Column(String, nullable=True)  # Token to track sync state
    
    user = relationship("User", back_populates="sync_metadata")

class UserDevice(Base):
    __tablename__ = "user_devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_email = Column(String, ForeignKey("users.email", ondelete="CASCADE"), nullable=False)
    device_id = Column(String, unique=True, index=True)
    device_name = Column(String(255), nullable=True)
    device_type = Column(String(50), nullable=True)  # mobile, desktop, tablet, etc.
    operating_system = Column(String(100), nullable=True)
    browser = Column(String(100), nullable=True)
    browser_version = Column(String(50), nullable=True)
    device_fingerprint = Column(String(512), nullable=True)  # Browser/device fingerprint
    last_ip_address = Column(INET, nullable=True)
    last_location = Column(String(255), nullable=True)  # General location data
    is_trusted = Column(Boolean, default=False)
    is_current = Column(Boolean, default=True)
    first_seen_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)  # Use UTC
    last_seen_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)  # Use UTC
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)  # Use UTC
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)  # Use UTC

    user = relationship("User", back_populates="devices")
    login_attempts = relationship("LoginAttempt", back_populates="device", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('user_email', 'device_id', name='uq_user_device'),
    )

class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_email = Column(String, ForeignKey("users.email", ondelete="CASCADE"), nullable=True)
    device_id = Column(UUID(as_uuid=True), ForeignKey("user_devices.id", ondelete="SET NULL"), nullable=True)
    email = Column(String(255), nullable=False, index=True)
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="FAILED")
    method = Column(String, nullable=False, default="PASSWORD")
    attempted_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)  # Use UTC
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)  # Use UTC
    failure_reason = Column(String(255), nullable=True)
    location_info = Column(Text, nullable=True)

    user = relationship("User", back_populates="login_attempts")
    device = relationship("UserDevice", back_populates="login_attempts")

class RecoveryCode(Base):
    __tablename__ = "recovery_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_email = Column(String, ForeignKey("users.email", ondelete="CASCADE"), nullable=False)
    code = Column(String(255), nullable=False, index=True)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)  # Use UTC
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="recovery_codes")

    __table_args__ = (
        UniqueConstraint('user_email', 'code', name='uq_user_recovery_code'),
    )
    

class WebAuthnCredential(Base):
    """
    Model to store WebAuthn credentials
    """
    __tablename__ = "webauthn_credentials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    credential_id = Column(LargeBinary, nullable=False)
    public_key = Column(LargeBinary, nullable=False)
    sign_count = Column(Integer, default=0)

    # Relationship to User model
    user = relationship("User", back_populates="webauthn_credentials")