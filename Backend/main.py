from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import auth, websocket
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
app.include_router(websocket.router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"msg" : "Hi vro"}

if __name__=="__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)