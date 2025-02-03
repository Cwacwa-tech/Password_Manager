# backend/app/main.py
from fastapi import FastAPI
from app.routers import auth, vault, sync

app = FastAPI(title="Password Manager API")

# Include the routers
app.include_router(auth.router)
app.include_router(vault.router)
app.include_router(sync.router)
