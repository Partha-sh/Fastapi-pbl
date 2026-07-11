from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.routers.users import router as user_router
from app.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("MongoDB Connected Successfully 🚀")
    yield



app = FastAPI(
    title="PixShare API",
    version="1.0.0",
    lifespan=lifespan,
)
from app.routers.auth import router as auth_router
from app.routers.posts import router as post_router

app.include_router(auth_router)
app.include_router(post_router)
app.include_router(user_router)

@app.get("/")
async def root():
    return {"message": "PixShare API Running 🚀"}