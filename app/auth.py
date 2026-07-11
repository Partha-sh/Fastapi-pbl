from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict):

    payload = data.copy()

    payload["exp"] = datetime.utcnow() + timedelta(hours=1)

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )