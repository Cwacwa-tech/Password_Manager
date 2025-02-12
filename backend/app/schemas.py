# backend/app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
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

class VaultEntryCreate(BaseModel):
    site: str
    username: str
    password: str  # Plaintext; will be encrypted

class VaultEntryOut(BaseModel):
    id: int
    site: str
    username: str
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
    user_id: int

    class Config:
        orm_mode = True