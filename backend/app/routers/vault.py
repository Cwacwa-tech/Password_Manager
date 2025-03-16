from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user, get_redis
from app.schemas import VaultEntryCreate, VaultEntryOut, SharedUserCreate
from app.services.encryption import EncryptionService
from app.models import VaultEntry, User, SharedUser
from app.utils.security import verify_access_token
from typing import List, Union
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
import json

router = APIRouter(
    prefix="/vault",
    tags=["vault"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/passwords", response_model=Union[VaultEntryOut, dict])
def add_password(entry: VaultEntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if an entry for this site already exists
    existing_entries = db.query(VaultEntry).filter(
        VaultEntry.user_email == current_user.email,
        VaultEntry.site == entry.site
    ).all()
    
    # If entries exist for this site, check username and password
    encryption_service = EncryptionService()
    
    # Check all existing entries for the same site
    for existing_entry in existing_entries:
        # If username matches, check password
        if existing_entry.username == entry.username:
            # Decrypt the stored password
            decrypted_password = encryption_service.decrypt_password(existing_entry.encrypted_password)
            
            # If passwords match, it's a duplicate
            if decrypted_password == entry.password:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message": "Password already saved!"}
                )
    
    # If we get here, it's not a duplicate, so save it
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