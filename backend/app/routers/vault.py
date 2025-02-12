# backend/app/routers/vault.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, get_redis
from app.schemas import VaultEntryCreate, VaultEntryOut, SharedUserCreate
from app.services.encryption import EncryptionService
from app.models import VaultEntry, User, SharedUser
from app.utils.security import verify_access_token

from typing import List
from fastapi.security import OAuth2PasswordBearer
import json

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
    shared_entries = db.query(VaultEntry).join(SharedUser).filter(SharedUser.user_email == current_user.email).all()
    return db_entries

@router.post("/share", response_model=SharedUserCreate)
def share_entry(shared_user: SharedUserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vault_entry = db.query(VaultEntry).filter(VaultEntry.id == shared_user.vault_entry_id).first()
    if vault_entry.user_email != current_user.email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to share this entry")
    
    shared_user_entry = SharedUser(
        vault_entry_id=shared_user.vault_entry_id,
        user_email=shared_user.user_email
    )
    db.add(shared_user_entry)
    db.commit()
    db.refresh(shared_user_entry)
    return shared_user_entry