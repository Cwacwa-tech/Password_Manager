import sys
import json
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from redis import Redis
import fido2
from fido2.webauthn import (
    PublicKeyCredentialRpEntity,
    PublicKeyCredentialDescriptor,
    AuthenticatorAssertionResponse
)
from fido2.server import Fido2Server
from fido2 import cbor

from app.dependencies import get_db, get_redis, get_current_user
from app.models import User, WebAuthnCredential
from app.schemas import WebAuthnRegistrationRequest, WebAuthnLoginRequest
from app.utils.security import create_access_token

router = APIRouter(
    prefix="/webauthn",
    tags=["webauthn"]
)

# Configure your Relying Party (RP) details
RP_NAME = "Your Application Name"
RP_ID = "localhost"  # Change this to your domain in production

# Initialize FIDO2 Server
rp = PublicKeyCredentialRpEntity(RP_ID, RP_NAME)
server = Fido2Server(rp)

@router.post("/register/begin")
async def webauthn_register_begin(
    request: WebAuthnRegistrationRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """
    Begin WebAuthn registration process
    """
    # Check if user already has registered credentials
    existing_credentials = db.query(WebAuthnCredential).filter(
        WebAuthnCredential.user_id == current_user.id
    ).all()

    # Prepare registration options
    registration_data, state = server.register_begin({
        'id': str(current_user.id).encode(),
        'name': current_user.email,
        'displayName': current_user.email,
    }, [PublicKeyCredentialDescriptor(cred.credential_id) for cred in existing_credentials], user_verification='preferred')

    # Store the registration state in Redis
    redis_client.set(f"webauthn_registration_state:{current_user.email}", 
                     json.dumps(state), 
                     ex=600)  # 10 minutes expiration

    return cbor.encode(registration_data)

@router.post("/register/complete")
async def webauthn_register_complete(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """
    Complete WebAuthn registration process
    """
    # Retrieve registration state from Redis
    state_json = redis_client.get(f"webauthn_registration_state:{current_user.email}")
    if not state_json:
        raise HTTPException(status_code=400, detail="Registration state expired")

    state = json.loads(state_json)

    # Get the raw registration data
    data = await request.body()
    registration_data = cbor.decode(data)

    # Complete registration
    try:
        auth_data = server.register_complete(state, registration_data)
        
        # Store the credential in the database
        credential = WebAuthnCredential(
            user_id=current_user.id,
            credential_id=auth_data.credential_data.credential_id,
            public_key=auth_data.credential_data.public_key,
            sign_count=auth_data.credential_data.sign_count
        )
        db.add(credential)
        db.commit()

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login/begin")
async def webauthn_login_begin(
    request: WebAuthnLoginRequest,
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """
    Begin WebAuthn login process
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user's registered credentials
    credentials = db.query(WebAuthnCredential).filter(
        WebAuthnCredential.user_id == user.id
    ).all()

    if not credentials:
        raise HTTPException(status_code=400, detail="No credentials registered")

    # Convert credentials for FIDO2 server
    allow_credentials = [
        PublicKeyCredentialDescriptor(cred.credential_id) 
        for cred in credentials
    ]

    # Begin authentication
    login_data, state = server.authenticate_begin(allow_credentials, user_verification='preferred')

    # Store login state in Redis
    redis_client.set(f"webauthn_login_state:{user.email}", 
                     json.dumps(state), 
                     ex=600)  # 10 minutes expiration

    return cbor.encode(login_data)

@router.post("/login/complete")
async def webauthn_login_complete(
    request: Request,
    db: Session = Depends(get_db),
    redis_client: Redis = Depends(get_redis)
):
    """
    Complete WebAuthn login process
    """
    # Get request data
    data = await request.body()
    credential_data = cbor.decode(data)

    # Extract email from credential
    email = credential_data.get('email')
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided")

    # Retrieve login state from Redis
    state_json = redis_client.get(f"webauthn_login_state:{email}")
    if not state_json:
        raise HTTPException(status_code=400, detail="Login state expired")

    state = json.loads(state_json)

    # Find user and their credentials
    user = db.query(User).filter(User.email == email).first()
    credentials = db.query(WebAuthnCredential).filter(
        WebAuthnCredential.user_id == user.id
    ).all()

    try:
        # Complete authentication
        auth_data = server.authenticate_complete(
            state, 
            [
                PublicKeyCredentialDescriptor(cred.credential_id)  
                for cred in credentials
            ],
            credential_data
        )

        # Update sign count
        credential = next((cred for cred in credentials if cred.credential_id == auth_data.credential_data.credential_id), None)
        if credential:
            credential.sign_count = auth_data.credential_data.sign_count
            db.commit()

        # Generate access token
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
