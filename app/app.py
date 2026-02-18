from contextlib import asynccontextmanager
import uuid
from app.schemas import PostCreate, PostResponse, UserRead, UserCreate, UserUpdate
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import Post, create_db_and_tables, get_async_session
from app.images import imagekit
import os
from app.users import auth_backend, current_active_user, fastapi_users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(fastapi_users.get_auth_router(auth_backend), prefix='/auth/jwt', tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    caption: str = Form(""),
    session: AsyncSession = Depends(get_async_session),
):
    
    # now with the url we are getting we can change the components of 
    # the url to make changes in too the image acc to our need

    try:
        file_bytes = await file.read()
        uploaded = await run_in_threadpool(
            lambda: imagekit.files.upload(
                file=file_bytes,
                file_name=file.filename or "upload.bin",
                use_unique_file_name=True,
                folder="/posts",
            )
        )

        if not uploaded or not uploaded.url:
            raise HTTPException(status_code=400, detail="Upload failed")

        post = Post(
            caption=caption,
            url=uploaded.url,
            file_type=uploaded.file_type,
            file_name=uploaded.name,
        )

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    finally:
        await file.close()


    
    session.add(post)
    await session.commit()
    await session.refresh(post)
    return post


@app.get("/feed")
async def get_feed(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Post).order_by(Post.created_at.desc()))
    posts = [row[0] for row in result.all()]

    posts_data = []
    for post in posts:
        posts_data.append(
            {
                "id": str(post.id),
                "caption": post.caption,
                "url": post.url,
                "file_type": post.file_type,
                "file_name": post.file_name,
                "created_at": post.created_at.isoformat(),
            }
        )

    return {"posts": posts_data}


@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, session: AsyncSession = Depends(get_async_session)):
    try:
        post_uuid = uuid.UUID(post_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid post id format")

    result = await session.execute(select(Post).where(Post.id == post_uuid))
    post = result.scalars().first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    await session.delete(post)
    await session.commit()
    return {"success": True, "message": "Post deleted successfully"}
