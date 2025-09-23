from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from database import session, VoiceMsgs, Users
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from auth import verify_session_token
from sqlalchemy import select
from tempfile import NamedTemporaryFile
from subprocess import run, PIPE
from fastapi.responses import StreamingResponse
import io
import zipfile
import os
from json import loads
from struct import pack
from coolname import generate_slug
from auth import verify_session_token
router = APIRouter(prefix="/voice")

def get_db():
    with session() as db:
        yield db

class Connection_Manager:
    def __init__(self):
        self.active_connections : dict[str, WebSocket] = {}
    async def add_connection(self, websocket : WebSocket, username  : str):
        await websocket.accept()
        self.active_connections[username] = websocket
    def disconnect(self, username : str):
         if username in self.active_connections:
              del self.active_connections[username]
    async def send_message(self, message):
         for connection in self.active_connections:
              await self.active_connections[connection].send_bytes(message)

manager = Connection_Manager()


@router.websocket("/ws")
async def voice_conn(user: WebSocket, db : Session = Depends(get_db)):
    username = "username"
    await manager.add_connection(user, username)
    try:
        expiry_seconds = 0
        while True:
            data = await user.receive()
            if "bytes" in data:
                time = datetime.now(timezone.utc)
                try:
                    with NamedTemporaryFile(suffix=".webm", delete=False) as temp_input:
                        temp_input.write(data["bytes"])
                        temp_input.flush()
                        output_tmp = NamedTemporaryFile(suffix=".webm", delete=False)
                        output_tmp.close()
                        voice_convert = run([
                            'ffmpeg',
                            '-y',
                            '-i', temp_input.name,
                            '-af', "asetrate=55000,atempo=0.85,afftfilt=real='hypot(re,im)*sin(65)',tremolo=f=50,adynamicsmooth=sensitivity=2.5:basefreq=10000",
                            output_tmp.name
                        ],
                        stdout=PIPE,
                        stderr=PIPE
                        )
                        if voice_convert.returncode !=0:
                            await user.send_text("An error occured")
                            break
                    with open(output_tmp.name, "rb") as return_file:
                        payload = return_file.read()
                        expiry = VoiceMsgs.get_expiry(expiry_seconds)
                        voicemsg = VoiceMsgs(
                             username = username,
                             msg = payload,
                             time_sent = time,
                             expiry = expiry
                        )
                        db.add(voicemsg)
                        db.commit()
                        username_payload = username.encode("utf-8")
                        username_length = len(username_payload)
                        time_sent = pack(">d", time.timestamp())
                        expiry_time = pack(">d", expiry.timestamp())

                        complete_payload = time_sent + expiry_time + username_length.to_bytes(4, "big") + username_payload + payload
                        await manager.send_message(complete_payload)
                except WebSocketDisconnect:
                    print("closed")
                except Exception as e:
                    print(e)
                    try:
                        await user.send_text("An error occured")
                    except:
                         pass
                    break
                finally:
                    os.remove(temp_input.name)
                    os.remove(output_tmp.name)

            elif "text" in data:
                js = loads(data["text"])
                if "anonymity" in js:
                     while True:
                        username = generate_slug(2)
                        already_exists = db.execute(select(Users).where(Users.username == username)).scalar_one_or_none()
                        if not already_exists:
                             break
                expiry_seconds = int(js["expiry"])
    except WebSocketDisconnect:
         print("closed")
    except Exception as e:
                    print(e)
                    try:
                        await user.send_text("An error occured")
                    except:
                         pass
    finally:
         manager.disconnect(username)

@router.get("/getmsgs")
async def get_msgs(db : Session = Depends(get_db)):
    time = datetime.now(timezone.utc) + timedelta(seconds=2)
    db_data = db.execute(select(VoiceMsgs).where(VoiceMsgs.expiry > time)).scalars().all()
    zip_file = io.BytesIO()
    with zipfile.ZipFile(zip_file, mode="w") as zipF:
        for msg in db_data:
            expiry = pack(">d", msg.expiry.timestamp())
            time_sent = pack(">d", msg.time_sent.timestamp())
            username  =  msg.username.encode("utf-8")
            zipF.writestr(msg.username + str(msg.expiry), time_sent + expiry + len(username).to_bytes(4, "big") + username + msg.msg)
    zip_file.seek(0)
    return StreamingResponse(zip_file)