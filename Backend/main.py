from fastapi import FastAPI
import auth
import os
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run
port = int(os.environ.get("PORT", 8000))
app = FastAPI()
app.include_router(auth.router)

origins = [
    "https://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__=="__main__":
    run("main:app", host="0.0.0.0", port=port)