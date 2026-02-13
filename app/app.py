from fastapi import FastAPI,HTTPException,File,UploadFile,Form,Depends
from app.schemas import PostCreate
from app.db import Post ,create_db_and_tables,get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select

@asynccontextmanager
async def lifespan(app:FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


# this helps us in creating the post when ever we upload a file
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    caption: str = Form(""),
    session: AsyncSession = Depends(get_async_session),
):
    

#her eis the example post that we have create(session) now we will commiut it to our db
    post  = Post(
        caption = caption,
        url = "dummy url"
        ,file_type = "photo",
        file_name = "dumm name"

    )
    session.add(post)
    await session.commit()
    await session.refresh(post)
    return post

# this will the feed which we will be getting after uploading the file
@app.get("/feed")
async def get_feed(session: AsyncSession = Depends(get_async_session)):
    # from this parameter we are getting all the post that has been created and the function explain us that we are getting the newest post

    result =  await session.execute(select(Post).order_by(Post.created_at.desc()))
    posts = [row[0] for row in result.all()]
# result.scalars().all() can also use this


    posts_data =[]
    for post in posts:
        posts_data.append({
            "id":str(post.id),
            "caption":post.caption,
            "url":post.url,
            "file_type" : post.file_type,
            "file_name" : post.file_name,
            "created_at": post.created_at.isoformat()
        })
        return {"posts": posts_data}


    
















# text_post = {
#     1: {"title": "Getting Started with FastAPI", "content": "Set up the project and created the first API endpoint."},
#     2: {"title": "Understanding Path Parameters", "content": "Built `/post/{id}` to fetch a specific post by numeric id."},
#     3: {"title": "Working with Query Params", "content": "Added `limit` as a query parameter to the `/posts` endpoint."},
#     4: {"title": "HTTP Exceptions in FastAPI", "content": "Used `HTTPException` to return 404 when a post does not exist."},
#     5: {"title": "Why Use Uvicorn", "content": "Uvicorn runs ASGI apps fast and supports auto-reload for development."},
#     6: {"title": "Debugging Import Errors", "content": "Fixed module path issues by organizing files in an `app` package."},
#     7: {"title": "Project Structure Tips", "content": "Kept `main.py` for startup and `app/app.py` for route definitions."},
#     8: {"title": "Version Control Basics", "content": "Initialized git, committed code, and pushed to GitHub main branch."},
#     9: {"title": "Protecting Secrets", "content": "Added `.env` to `.gitignore` to avoid committing sensitive values."},
#     10: {"title": "What’s Next", "content": "Plan to add POST, PUT, DELETE routes and connect a database."}
# }


# #query parameter
# @app.get("/posts")
# def get_all_posts(limit:int = None):
#     if limit:
#         #her ewe are converting the dict to a list as we cannot apply list opertaion on dict(there also many other wayst to do it)
#         return list(text_post.values())[:limit]  
#     return text_post

# #this is call making a path parameter
# @app.get("/post/{id}")
# def get_post(id:int):
#     #here we are making a http error raising form exceptional condition
#     if id not in text_post:
#         raise HTTPException(status_code=404,detail="post not found" )
#     return text_post.get(id)

# @app.post("/post")
# #here we are not receving the query parameter we are recieving the body wehave created in schemas

# def create_post(post: PostCreate):#--> PostCreate '''here if we write this syntax we can see that what should be returned or posted (as specified into the schemas)''')
#     new_post = {"title":post.title,"content":post.content}
#     text_post[max(text_post.keys()) + 1] = new_post
#     return new_post


# # we can also do the same for delete
