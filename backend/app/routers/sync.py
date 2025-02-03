# backend/app/routers/sync.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.synchronization import SyncService
from app.schemas import UserOut
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/sync",
    tags=["sync"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/")
def sync_vault(vault_data: dict, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    sync_service = SyncService(db)
    if sync_service.sync_vault(token, vault_data):
        return {"message": "Vault synchronized successfully"}
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to synchronize vault")
