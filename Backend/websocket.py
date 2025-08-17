from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query 
from database import session, Msgs, Msg_return
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from typing import Annotated
from datetime import datetime, timezone, timedelta
from auth import verify_session_token
import asyncio
router = APIRouter()

def get_db(): 
    with session() as db:
        yield db

class ConnectionManager:
    def __init__(self):
        self.connections : dict[str, WebSocket] = {}
    async def add_connection(self, websocket : WebSocket, username : str):
        await websocket.accept()
        self.connections[username] = websocket
    def disconnect(self, username : str):
      if username in self.connections:
        del self.connections[username]
    async def send_message(self, message : Msg_return):
        for user in self.connections:
            await self.connections[user].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws")
async def websoc(user : WebSocket, db : Session = Depends(get_db), payload = Depends(verify_session_token)):
    MAX_TIME = payload["exp"]
    username = payload["username"]
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
                db.add(message)
                db.commit()
                await manager.send_message(temp)
                print("lalreler")
            except WebSocketDisconnect:
                manager.disconnect(username)
                break
            except asyncio.TimeoutError:
                manager.disconnect(username)
                break
            except Exception as e:
                await manager.connections[username].send_text("An error occured")
                manager.disconnect(username)
                print("An exception occured", e)
                break
    finally:
        if username in manager.connections:
            manager.disconnect(username)

@router.get("/getchatmsgs")
async def send_messages(db : Session = Depends(get_db), payload = Depends(verify_session_token)):
    time = datetime.now(timezone.utc) + timedelta(seconds=5)
    msgs = db.execute(select(Msgs).where(Msgs.expiry > time)).scalars().all()
    msgs_return = []
    for msg in msgs:
        msgs_return.append(Msg_return.from_orm(msg))
    return {
        "msg" : "Success",
        "msgs" : msgs_return
    }

@router.get("/livecount")
def total_active(payload = Depends(verify_session_token)):
    return {
        "msg" : "Success",
        "total":len(manager.connections)
        }