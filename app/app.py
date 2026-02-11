from fastapi import FastAPI,HTTPException
from app.schemas import PostCreate

app = FastAPI()

text_post = {
    1: {"title": "Getting Started with FastAPI", "content": "Set up the project and created the first API endpoint."},
    2: {"title": "Understanding Path Parameters", "content": "Built `/post/{id}` to fetch a specific post by numeric id."},
    3: {"title": "Working with Query Params", "content": "Added `limit` as a query parameter to the `/posts` endpoint."},
    4: {"title": "HTTP Exceptions in FastAPI", "content": "Used `HTTPException` to return 404 when a post does not exist."},
    5: {"title": "Why Use Uvicorn", "content": "Uvicorn runs ASGI apps fast and supports auto-reload for development."},
    6: {"title": "Debugging Import Errors", "content": "Fixed module path issues by organizing files in an `app` package."},
    7: {"title": "Project Structure Tips", "content": "Kept `main.py` for startup and `app/app.py` for route definitions."},
    8: {"title": "Version Control Basics", "content": "Initialized git, committed code, and pushed to GitHub main branch."},
    9: {"title": "Protecting Secrets", "content": "Added `.env` to `.gitignore` to avoid committing sensitive values."},
    10: {"title": "What’s Next", "content": "Plan to add POST, PUT, DELETE routes and connect a database."}
}


#query parameter
@app.get("/posts")
def get_all_posts(limit:int = None):
    if limit:
        #her ewe are converting the dict to a list as we cannot apply list opertaion on dict(there also many other wayst to do it)
        return list(text_post.values())[:limit]  
    return text_post

#this is call making a path parameter
@app.get("/post/{id}")
def get_post(id:int):
    #here we are making a http error raising form exceptional condition
    if id not in text_post:
        raise HTTPException(status_code=404,detail="post not found" )
    return text_post.get(id)

@app.post("/post")
#here we are not receving the query parameter we are recieving the body wehave created in schemas

def create_post(post: PostCreate):#--> PostCreate '''here if we write this syntax we can see that what should be returned or posted (as specified into the schemas)''')
    new_post = {"title":post.title,"content":post.content}
    text_post[max(text_post.keys()) + 1] = new_post
    return new_post
