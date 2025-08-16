from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from database import session, Msgs
from sqlalchemy.orm import Session
from datetime import datetime, timezone
router = APIRouter()

def get_db():
    db = session()
    try:
        yield db
    except:
        db.rollback()
    finally:
        db.close()


# @router.get("/getchatmsgs")
# async def send_messages(db : Session = Depends(get_db)):
db = session()
msgs = db.query(Msgs).filter_by(expiry = datetime.now(timezone.utc)).all()
print(msgs)
db.close()