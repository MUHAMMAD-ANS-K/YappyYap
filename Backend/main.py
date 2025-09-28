from fastapi import FastAPI, UploadFile, File, HTTPException, status, Depends, Form, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
import auth, websocket, voicewebsoc, components
import os
import io
from tempfile import NamedTemporaryFile
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from database import session
from typing import Annotated
app = FastAPI()
app.include_router(auth.router)
app.include_router(voicewebsoc.router)
app.include_router(websocket.router)
app.include_router(components.router)

origins = [
    "https://muhammadans.com",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    with session() as db:
        yield db

@app.get("/userdetails")
def user_details():
    username = "Ghost"
    user_type = "Permanent"
    # raise HTTPException(status_code=404)
    return {
        "username" : username,
        "user_type" : user_type
    }
@app.get("/")
def root():
    return {"msg" : "Hi vro"}

if __name__=="__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)