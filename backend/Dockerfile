FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for psycopg2 and others
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    net-tools procps \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure environment variables are set correctly for database
# They will be passed through docker-compose
# The application should pick up DATABASE_URL and REDIS_URL from the environment.

# Set the default environment variable for SQLAlchemy (use .env from docker-compose)
# We will rely on this URL being set by docker-compose or .env file
# ENV SQLALCHEMY_DATABASE_URL=postgresql://postgres:morie123@db:5432/postgres

# Start the app with uvicorn on port 80 and run alembic migrations before starting
CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 80
