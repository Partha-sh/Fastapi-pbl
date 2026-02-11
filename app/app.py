from fastapi import FastAPI,HTTPException

app = FastAPI()

text_post = {1:{"tital" : "new post","content":"cool test post"}}
#query parameter
@app.get("/posts")
def get_all_posts():
    return text_post

#this is call making a path parameter
@app.get("/post/{id}")
def get_post(id:int):
    #here we are making a http error raising form exceptional condition
    if id not in text_post:
        raise HTTPException(status_code=404,detail="post not found" )
    return text_post.get(id)