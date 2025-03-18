# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
import datetime

class UserCreate(BaseModel):
    username: str 
    email: EmailStr
    master_password: Optional[str] = Field(None, description="Leave empty to generate a password.")
    #generate_password: bool = Field(False, description="Set to True to generate a password.")

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

class UserRegistrationResponse(BaseModel):
    user: UserOut
    recovery_codes: List[str]
    totp_secret: str

    class Config:
        orm_mode = True

class VaultEntryCreate(BaseModel):
    site: str
    username: str
    password: str  # Plaintext; will be encrypted

class VaultEntryAddResponse(BaseModel):
    id: int
    site: str
    username: str
    last_modified: datetime.datetime

    class Config:
        orm_mode = True

class VaultEntryOut(BaseModel):
    id: int
    site: str
    username: str
    password: Optional[str] = None 
    last_modified: datetime.datetime

    class Config:
        orm_mode = True
        
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    master_password: str

class SharedUserCreate(BaseModel):
    vault_entry_id: int
    user_email: EmailStr

    class Config:
        orm_mode = True

# Device Registration
class DeviceRegistration(BaseModel):
    device_name: str = Field(..., description="Name of the device being registered")
    device_type: str = Field(..., description="Type of device (browser, mobile, desktop)")
    
class DeviceRegistrationResponse(BaseModel):
    device_id: str
    message: str

# Synchronization
class SyncRequest(BaseModel):
    device_id: str
    last_sync: Optional[str] = None  # ISO format timestamp
    sync_token: Optional[str] = None
    changes: List[Dict[str, Any]] = []

class SyncResponse(BaseModel):
    changes: List[Dict[str, Any]]
    sync_token: str
    last_sync: str

class ConflictResolution(BaseModel):
    device_id: str
    item_id: int
    resolution_strategy: str = Field(..., description="Either 'server' or 'client'")
    client_data: Optional[Dict[str, Any]] = None