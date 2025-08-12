from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# import auth
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# app.include_router(auth.router)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users = []

@app.websocket("/ws")
async def websoc(user : WebSocket):
    await user.accept()
    users.append(user)
    while True:
        try:
            msg = await user.receive_text()
            for u in users:
                await u.send_text(msg)
        except WebSocketDisconnect:
            print("-->LEfT<--")
        except:
            print("Unknown error")
        finally:
            if user in users:
                users.remove(user)
            break

