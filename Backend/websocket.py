from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query 
from database import session, Msgs, Msg_return
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from typing import Annotated
from datetime import datetime, timezone, timedelta

router = APIRouter()

def get_db(): 
    with session() as db:
        yield db

class ConnectionManager:
    def __init__(self):
        self.connections : dict[WebSocket, str] = {}
    async def add_connection(self, websocket : WebSocket, username : str):
        await websocket.accept()
        self.connections[websocket] = username
    def disconnect(self, websocket : WebSocket):
      if websocket in self.connections:
        del self.connections[websocket]
    async def send_message(self, message : Msg_return):
        for user in self.connections:
            await user.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws")
async def websoc(user : WebSocket, username : Annotated[str, Query()], db : Session = Depends(get_db)):
    await manager.add_connection(user, username)
    try:
        while True:
            try:
                data = await user.receive_json()
                seconds = int(data["expire"])
                msg = data["msg"]
                time = datetime.now(timezone.utc)
                message = Msgs(
                    msg = msg,
                    username = username,
                    time_sent = time,
                    expiry = time + timedelta(seconds=seconds)
                )
                temp = Msg_return.from_orm(message).model_dump_json()
                print(temp)
                db.add(message)
                db.commit()
                await manager.send_message(temp)
            except WebSocketDisconnect:
                manager.disconnect(user)
                break
            except Exception as e:
                await user.send_text("An error occured")
                await user.close()
                print("An exception occured", e)
                break
    finally:
        if user in manager.connections:
            manager.disconnect(user)

@router.get("/getchatmsgs")
async def send_messages(db : Session = Depends(get_db)):
    time = datetime.now(timezone.utc) + timedelta(seconds=5)
    msgs = db.execute(select(Msgs).where(Msgs.expiry > time)).scalars().all()
    msgs_return = []
    for msg in msgs:
        msgs_return.append(Msg_return.from_orm(msg))
    return {
        "msg" : "Success",
        "msgs" : msgs_return
    }