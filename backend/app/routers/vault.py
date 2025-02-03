# backend/app/routers/vault.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas import VaultEntryCreate, VaultEntryOut
from app.services.encryption import EncryptionService
from app.models import VaultEntry
from typing import List
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/vault",
    tags=["vault"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/passwords", response_model=VaultEntryOut)
def add_password(entry: VaultEntryCreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    encryption_service = EncryptionService()
    encrypted_password = encryption_service.encrypt_password(entry.password)
    db_entry = VaultEntry(
        user_id=1,  # This should be retrieved from the token
        site=entry.site,
        username=entry.username,
        encrypted_password=encrypted_password
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/passwords", response_model=List[VaultEntryOut])
def get_passwords(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    db_entries = db.query(VaultEntry).filter(VaultEntry.user_id == 1).all()  # User ID from token
    return db_entries
