# backend/app/routers/auth.py

import sys  

from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.schemas import UserCreate, UserOut, UserLogin, Token
from app.models import User

from redis import Redis

from sqlalchemy.orm import Session

from app.dependencies import get_db, get_redis # get_password  # Import the password generator function
from app.services.authentication import AuthenticationService
from app.utils.security import verify_password, create_access_token


from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import json

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"Received data: {user.dict()}", file=sys.stderr)  # Logs to stderr

    # If generate_password is True, generate a password
    #if user.generate_password:
    #    generated_password = get_password()  # Call the password generator
    #    user.master_password = generated_password["password is "]
    #    print(f"Generated password: {user.master_password}", file=sys.stderr)

    # Validate that master_password is provided or generated
    if not user.master_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required or generate_password must be True."
        )

    auth_service = AuthenticationService(db)
    db_user = auth_service.create_user(user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), redis_client: Redis = Depends(get_redis)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(form_data.password, user.master_password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})

    # Store session in Redis
    redis_client.set(f"session:{user.email}", json.dumps({
        "user_id": user.id,
        "email": user.email
    }))

    return {"access_token": access_token, "token_type": "bearer"}

