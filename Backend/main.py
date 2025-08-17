from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import auth, websocket
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(auth.router)
app.include_router(websocket.router)

origins = [
    "https://muhammadans.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users = []

# @app.websocket("/ws")
# async def websoc(user : WebSocket):
#     await user.accept()
#     users.append(user)
#     # print(user.open)
#     try:
#         while True:
#             try:
#                 msg = await user.receive_text()
#                 for u in users:
#                     await u.send_text(msg)
#             except WebSocketDisconnect:
#                 print("-->LEfT<--")
#                 break
#             except:
#                 print("Unknown error")
#     finally:
#             if user in users:
#                 users.remove(user)

if __name__=="__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)