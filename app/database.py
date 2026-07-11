import os
import certifi
from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.models import User, Post

load_dotenv()

client = AsyncMongoClient(
    os.getenv("MONGODB_URL"),
    tlsCAFile=certifi.where()
)

database = client[os.getenv("DATABASE_NAME")]


async def init_db():
    await init_beanie(
        database=database,
        document_models=[User, Post],
    )