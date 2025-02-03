# backend/app/dependencies.py
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from redis import Redis
import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL =os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

redis_client = Redis(host='redis', port=6379, db=0)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
