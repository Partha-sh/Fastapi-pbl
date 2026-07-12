from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers.auth import router as auth_router
from app.routers.posts import router as post_router
from app.routers.users import router as user_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("MongoDB Connected Successfully 🚀")
    yield


app = FastAPI(
    title="PixShare API",
    description="""
A cloud-based social media backend built with FastAPI, MongoDB Atlas and ImageKit.

Features:
- JWT Authentication
- Image Upload
- User Profiles
- Post Management
- RESTful API
""",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(post_router)
app.include_router(user_router)


@app.get("/")
async def root():
    return {"message": "PixShare API Running 🚀"}