# backend/app/routers/vault.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas import VaultEntryCreate, VaultEntryOut
from app.services.encryption import EncryptionService
from app.models import VaultEntry, User
from app.utils.security import verify_access_token

from typing import List
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/vault",
    tags=["vault"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/passwords", response_model=VaultEntryOut)
def add_password(entry: VaultEntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    encryption_service = EncryptionService()
    encrypted_password = encryption_service.encrypt_password(entry.password)
    db_entry = VaultEntry(
        user_email=current_user.email,
        site=entry.site,
        username=entry.username,
        encrypted_password=encrypted_password
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/passwords", response_model=List[VaultEntryOut])
def get_passwords(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_entries = db.query(VaultEntry).filter(VaultEntry.user_email == current_user.email).all()
    return db_entries