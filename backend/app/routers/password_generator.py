from fastapi import APIRouter, HTTPException
import secrets
import string

router = APIRouter(prefix="/password", tags=["Password Generator"])

def generate_password() -> str:
    """Generate a secure password with exactly 16 characters."""
    length = 16
    characters = string.ascii_uppercase + string.ascii_lowercase + string.digits + string.punctuation
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password

@router.get("/generate")
def generate_password_endpoint(length: int = 16):
    """
    Generate a secure password of the specified length.
    Default length is 16 characters.
    """
    if length < 8 or length > 64:
        raise HTTPException(
            status_code=400,
            detail="Password length must be between 8 and 64 characters."
        )
    
    password = generate_password(length)
    return {"password": password}