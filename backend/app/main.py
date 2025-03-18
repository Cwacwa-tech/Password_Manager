# backend/app/main.py
from fastapi import FastAPI, Depends
from app.routers import auth, vault, sync, password_generator
from app.models import Base


from fastapi.middleware.cors import CORSMiddleware
import os


app = FastAPI(
    title="Password Manager API",
    description="Secure API for password management and synchronization",
    version="1.0.0"
    )

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(auth.router)
app.include_router(vault.router)
app.include_router(sync.router)
app.include_router(password_generator.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}