# backend/app/routers/sync.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from typing import Dict, List, Any, Optional
from datetime import datetime, timezone

from app.dependencies import get_db, get_redis, get_current_user
from app.services.synchronization import SyncService, SynchronizationService
from app.schemas import UserOut
from app.models import User

from app.schemas import (
    DeviceRegistration, 
    DeviceRegistrationResponse,
    SyncRequest,
    SyncResponse,
    ConflictResolution
)

from redis import Redis

from fastapi.security import OAuth2PasswordBearer



router = APIRouter(
    prefix="/sync",
    tags=["synchronization"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/")
def sync_vault(vault_data: dict, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    sync_service = SyncService(db)
    if sync_service.sync_vault(token, vault_data):
        return {"message": "Vault synchronized successfully"}
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to synchronize vault")

@router.post("/register-device", response_model=DeviceRegistrationResponse)
def register_device(
    device_data: DeviceRegistration,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """Register a new device for synchronization"""
    sync_service = SynchronizationService(db, redis_client)
    device_id = sync_service.register_device(current_user.email, device_data.device_name)
    
    return {
        "device_id": device_id,
        "message": f"Device '{device_data.device_name}' registered successfully"
    }

@router.post("/pull", response_model=SyncResponse)
def pull_changes(
    sync_data: SyncRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """Pull changes from the server to a device"""
    sync_service = SynchronizationService(db, redis_client)
    
    # Parse the last_sync timestamp
    try:
        last_sync = datetime.fromisoformat(sync_data.last_sync) if sync_data.last_sync else datetime.min
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid timestamp format")
    
    # Get changes
    changes = sync_service.get_changes_since_last_sync(
        current_user.email, 
        sync_data.device_id,
        last_sync
    )
    
    # Get sync state
    sync_state = sync_service.get_sync_state(current_user.email, sync_data.device_id)
    
    return {
        "changes": changes,
        "sync_token": sync_state.get("sync_token"),
        "last_sync": sync_state.get("last_sync")
    }


@router.post("/push", response_model=Dict[str, Any])
def push_changes(
    sync_data: SyncRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """Push changes from a device to the server"""
    sync_service = SynchronizationService(db, redis_client)
    
    # Apply changes
    results = sync_service.apply_changes(
        current_user.email,
        sync_data.device_id,
        sync_data.changes
    )
    
    # Get sync state
    sync_state = sync_service.get_sync_state(current_user.email, sync_data.device_id)
    
    return {
        "results": results,
        "sync_token": sync_state.get("sync_token"),
        "last_sync": sync_state.get("last_sync")
    }

@router.post("/resolve-conflict", response_model=Dict[str, Any])
def resolve_conflict(
    resolution_data: ConflictResolution,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """Resolve a synchronization conflict"""
    sync_service = SynchronizationService(db, redis_client)
    
    result = sync_service.resolve_conflict(
        current_user.email,
        resolution_data.device_id,
        {
            "id": resolution_data.item_id,
            "resolution": resolution_data.resolution_strategy,
            "client_data": resolution_data.client_data
        }
    )
    
    return result

@router.get("/state", response_model=Dict[str, Any])
def get_sync_state(
    device_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """Get the current synchronization state for a device"""
    sync_service = SynchronizationService(db, redis_client)
    
    sync_state = sync_service.get_sync_state(current_user.email, device_id)
    
    return sync_state
