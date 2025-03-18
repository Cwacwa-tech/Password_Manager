# backend/app/routers/vault.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, get_redis
from app.schemas import VaultEntryCreate, VaultEntryOut, SharedUserCreate, VaultEntryAddResponse
from app.services.encryption import EncryptionService
from app.models import VaultEntry, User, SharedUser
from app.utils.security import verify_access_token

from datetime import datetime, timezone
import base64
from typing import List
from fastapi.security import OAuth2PasswordBearer
import json

router = APIRouter(
    prefix="/vault",
    tags=["vault"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/passwords", response_model=VaultEntryAddResponse)
def add_password(entry: VaultEntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    
    # Check if an entry for the same site and user already exists
    existing_entry = (
        db.query(VaultEntry)
        .filter(VaultEntry.user_email == current_user.email, VaultEntry.site == entry.site)
        .first()
    )

    if existing_entry:
        raise HTTPException(
            status_code=400,
            detail="Site already exists in the vault for this user."
        )

    # Convert LargeBinary from database to string using urlsafe_b64encode
    encryption_key_bytes = current_user.encryption_key  # This is already bytes from LargeBinary
    encryption_key_string = base64.urlsafe_b64encode(encryption_key_bytes).decode('utf-8')

    encryption_service = EncryptionService(master_key=encryption_key_string)
    encrypted_password = encryption_service.encrypt_vault_item(entry.password)
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


@router.put("/passwords/{entry_id}", response_model=VaultEntryAddResponse)
def update_password(
    entry_id: int,  # ID of the entry to update
    entry: VaultEntryCreate,  # New data for the entry
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch the existing entry
    existing_entry = (
        db.query(VaultEntry)
        .filter(VaultEntry.id == entry_id, VaultEntry.user_email == current_user.email)
        .first()
    )

    if not existing_entry:
        raise HTTPException(
            status_code=404,
            detail="Entry not found or you do not have permission to update it."
        )

    # Convert LargeBinary from database to string using urlsafe_b64encode
    encryption_key_bytes = current_user.encryption_key  # This is already bytes from LargeBinary
    encryption_key_string = base64.urlsafe_b64encode(encryption_key_bytes).decode('utf-8')

    # Encrypt the new password
    encryption_service = EncryptionService(master_key=encryption_key_string)
    encrypted_password = encryption_service.encrypt_vault_item(entry.password)

    # Update the existing entry
    existing_entry.site = entry.site
    existing_entry.username = entry.username
    existing_entry.encrypted_password = encrypted_password
    existing_entry.last_modified = datetime.now(timezone.utc)  # Update the timestamp

    db.commit()
    db.refresh(existing_entry)

    # Return the updated entry
    return VaultEntryAddResponse.from_orm(existing_entry)

"""
@router.get("/passwords", response_model=List[VaultEntryOut])
def get_passwords(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_entries = db.query(VaultEntry).filter(VaultEntry.user_email == current_user.email).all()
    shared_entries = db.query(VaultEntry).join(SharedUser).filter(SharedUser.user_email == current_user.email).all()
    return db_entries
"""

"""
@router.get("/get-passwords")
async def get_passwords(website: str, db: Session = Depends(get_db)):
    # Query the database for saved passwords for the given website
    passwords = db.query(Password).filter(Password.website == website).all()
    return passwords
"""

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

@router.get("/passwords", response_model=List[VaultEntryOut])
def get_passwords_for_website(
    website: str = Query(..., description="Website URL to retrieve passwords for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve saved passwords for a specific website.
    """

    encryption_key_bytes = current_user.encryption_key  # This is already bytes from LargeBinary
    encryption_key_string = base64.urlsafe_b64encode(encryption_key_bytes).decode('utf-8')
    encryption_service = EncryptionService(encryption_key_string)
    

    # Query the database for entries matching the website
    db_entries = db.query(VaultEntry).filter(
        VaultEntry.user_email == current_user.email,
        VaultEntry.site == website
    ).all()

    # Query shared entries for the website
    shared_entries = db.query(VaultEntry).join(SharedUser).filter(
        SharedUser.user_email == current_user.email,
        VaultEntry.site == website
    ).all()

    # Combine all entries
    all_entries = db_entries + shared_entries

    # Decrypt passwords and create response objects

    results = []
    for entry in all_entries:
        try: 
            # Decrypt the password
            decrypted_data = encryption_service.decrypt_vault_item(entry.encrypted_password)
            password = decrypted_data.get("value")


            if not password:
                print(f"Warning: Empty password for entry ID: {entry.id}")
                password = "(unable to decrypt)"  # Provide a fallback
                

            # Create response object with decrypted password
            results.append(VaultEntryOut(
                id=entry.id,
                site=entry.site,
                username=entry.username,
                password=password,
                last_modified=entry.last_modified
            ))
        except Exception as e:
            print(f"Error decrypting password for entry {entry.id}: {str(e)}")

            # Handle decryption errors (this might happen with shared entries 

            results.append(VaultEntryOut(
                id=entry.id,
                site=entry.site,
                username=entry.username,
                password="(decryption failed)",
                last_modified=entry.last_modified
            ))
            
    #
    return results



@router.delete("/passwords/{entry_id}")
def delete_password(
    entry_id: int,  # ID of the entry to delete
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch the existing entry
    existing_entry = (
        db.query(VaultEntry)
        .filter(VaultEntry.id == entry_id, VaultEntry.user_email == current_user.email)
        .first()
    )

    if not existing_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found or you do not have permission to delete it."
        )

    # Delete the entry
    db.delete(existing_entry)
    db.commit()

    return {"message": "Entry deleted successfully."}



@router.post("/capture-credentials", response_model=VaultEntryOut)
def capture_credentials(
    entry: VaultEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save captured credentials from a login form.
    """
    encryption_service = EncryptionService()
    encrypted_password = encryption_service.encrypt_vault_item(entry.password)

    # Check if the entry already exists
    existing_entry = db.query(VaultEntry).filter(
        VaultEntry.user_email == current_user.email,
        VaultEntry.site == entry.site,
        VaultEntry.username == entry.username
    ).first()

    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Credentials for this site and username already exist."
        )

    # Create a new vault entry
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