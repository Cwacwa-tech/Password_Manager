# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime

class UserCreate(BaseModel):
    username: str 
    email: EmailStr
    master_password: str

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