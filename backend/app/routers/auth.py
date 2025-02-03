# backend/app/routers/auth.py

import sys  

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import UserCreate, UserOut, UserLogin, Token
from app.models import User
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.authentication import AuthenticationService
from app.utils.security import verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"Received data: {user.dict()}", file=sys.stderr)  # Logs to stderr
    auth_service = AuthenticationService(db)
    db_user = auth_service.create_user(user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(form_data.password, user.master_password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

    