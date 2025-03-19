# backend/app/services/synchronization.py
from datetime import datetime, timezone
import uuid
from typing import List, Dict, Any, Optional
from redis import Redis
import json

from app.models import User, VaultEntry, SyncMetadata
from app.services.encryption import EncryptionService #decrypt_data, encrypt_data

from sqlalchemy.orm import Session

class SyncService:
    def __init__(self, db: Session, redis : Redis):
        self.db = db
        self.redis = redis
=======
from sqlalchemy.orm import Session

class SyncService:
    def __init__(self, db: Session):
        self.db = db
>>>>>>> 99e95de555d3dbb52fc88c0f4939581a0a765814
    
    def sync_vault(self, token: str, vault_data: dict) -> bool:
        # For now, this is just a placeholder logic
        # Implement the synchronization logic
        return True

class SynchronizationService:
    def __init__(self, db: Session, redis_client: Redis):
        self.db = db
        self.redis = redis_client

    def register_device(self, user_email: str, device_name: str) -> str:
        """Register a new device for a user and return the device ID"""
        device_id = str(uuid.uuid4())

        # Create sync metadata for this device
        sync_metadata = SyncMetadata(
            user_email=user_email,
            device_id=device_id,
            last_sync=datetime.now(timezone.utc),
            sync_token=str(uuid.uuid4())
        )

        self.db.add(sync_metadata)
        self.db.commit()

        # Store device name in Redis for easier lookup
        self.redis.hset(f"user:{user_email}:devices", device_id, device_name)

        return device_id

    def get_changes_since_last_sync(self, user_email: str, device_id: str, last_sync: datetime) -> List[Dict[str, Any]]:
        """Get all changes that have occurred since the last sync for this device"""

        # Find entries that have been updated since the last sync
        vault_entries = self.db.query(VaultEntry).filter(
            VaultEntry.user_email == user_email,
            VaultEntry.last_modified > last_sync,
            VaultEntry.last_modified_by != device_id
        ).all()

        changes = []
        for entry in vault_entries:
            changes.append({
                "id": entry.id,
                "site": entry.site,
                "username": entry.username,
                "encrypted_password": entry.encrypted_password.decode('utf-8'),
                "last_modified": entry.last_modified.isoformat(),
                "deleted": entry.deleted,
                "version": entry.version
            })

        return changes

    def apply_changes(self, user_email: str, device_id: str, changes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Apply changes from a device to the server and resolve conflicts"""

        results = {
            "success": [],
            "conflicts": []
        }

        for change in changes:
            entry_id = change.get("id")

            # Check if this is a new item (no ID) or an update to an existing item
            if entry_id is None:
                # New entry - create it
                new_entry = VaultEntry(
                    user_email=user_email,
                    site=change["site"],
                    username=change["username"],
                    encrypted_password=change["encrypted_password"].encode('utf-8'),
                    last_modified=datetime.now(timezone.utc),
                    last_modified_by=device_id,
                    version=1,
                    deleted=False
                )
                self.db.add(new_entry)
                self.db.flush()  # Get the ID without committing
                results["success"].append({"id": new_entry.id, "operation": "create"})
            else:
                # Existing entry - check for conflicts
                existing_entry = self.db.query(VaultEntry).filter(
                    VaultEntry.id == entry_id,
                    VaultEntry.user_email == user_email
                ).first()

                if not existing_entry:
                    results["conflicts"].append({
                        "id": entry_id,
                        "reason": "Entry not found"
                    })
                    continue

                # Check if this is a deletion
                if change.get("deleted", False):
                    existing_entry.deleted = True
                    existing_entry.version += 1
                    existing_entry.last_modified_by = device_id
                    existing_entry.last_modified = datetime.now(timezone.utc)
                    results["success"].append({"id": entry_id, "operation": "delete"})
                    continue

                # Check for version conflicts
                client_version = change.get("version", 1)
                server_version = existing_entry.version

                if client_version < server_version:
                    # Conflict detected - the server has a newer version
                    results["conflicts"].append({
                        "id": entry_id,
                        "server_version": server_version,
                        "client_version": client_version,
                        "reason": "Version conflict"
                    })
                    continue

                # Update the entry
                existing_entry.site = change["site"]
                existing_entry.username = change["username"]
                existing_entry.encrypted_password = change["encrypted_password"].encode('utf-8')
                existing_entry.version += 1
                existing_entry.last_modified_by = device_id
                existing_entry.last_modified = datetime.now(timezone.utc)

                results["success"].append({"id": entry_id, "operation": "update"})

        # Update the last sync time for this device
        sync_metadata = self.db.query(SyncMetadata).filter(
            SyncMetadata.user_email == user_email,
            SyncMetadata.device_id == device_id
        ).first()

        if sync_metadata:
            sync_metadata.last_sync = datetime.now(timezone.utc)
            sync_metadata.sync_token = str(uuid.uuid4())

        self.db.commit()

        return results

    def resolve_conflict(self, user_email: str, device_id: str, conflict_resolution: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve a conflict by either keeping the server version or replacing with client version"""

        entry_id = conflict_resolution.get("id")
        resolution = conflict_resolution.get("resolution")  # "server" or "client"
        client_data = conflict_resolution.get("client_data")

        existing_entry = self.db.query(VaultEntry).filter(
            VaultEntry.id == entry_id,
            VaultEntry.user_email == user_email
        ).first()

        if not existing_entry:
            return {"success": False, "reason": "Entry not found"}

        if resolution == "client" and client_data:
            # Client wins - update with client data
            existing_entry.site = client_data["site"]
            existing_entry.username = client_data["username"]
            existing_entry.encrypted_password = client_data["encrypted_password"].encode('utf-8')
            existing_entry.version += 1
            existing_entry.last_modified_by = device_id
            existing_entry.last_modified = datetime.now(timezone.utc)

            self.db.commit()
            return {"success": True, "resolution": "client"}
        elif resolution == "server":
            # Server wins - no changes needed
            return {"success": True, "resolution": "server"}
        else:
            return {"success": False, "reason": "Invalid resolution strategy"}

    def get_sync_state(self, user_email: str, device_id: str) -> Dict[str, Any]:
        """Get the current sync state for a device"""

        sync_metadata = self.db.query(SyncMetadata).filter(
            SyncMetadata.user_email == user_email,
            SyncMetadata.device_id == device_id
        ).first()

        if not sync_metadata:
            return {"error": "Device not registered"}

        return {
            "device_id": device_id,
            "last_sync": sync_metadata.last_sync.isoformat(),
            "sync_token": sync_metadata.sync_token
        }
