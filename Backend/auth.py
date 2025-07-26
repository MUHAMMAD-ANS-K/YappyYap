from database import Base, engine, session, Email_req, OTP_entry, OTP_verification
from fastapi import APIRouter, Depends, HTTPException
from send_email import send_otp
import random
from sqlalchemy.orm import Session
from datetime import datetime, timezone
router = APIRouter()
origins = [
    "http://localhost:5173",
]

Base.metadata.create_all(bind=engine)


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@router.post("/") 
async def otpsend(data : Email_req, db : Session = Depends(get_db)):
    random_otp = str(random.randint(10, 99)) + chr(65 + random.randint(0, 26)) + str(random.randint(10, 99)) + chr(65 + random.randint(0, 26))
    try:
        data = OTP_entry(
            email = data.email,
            otp = random_otp
        )
        db.add(data)
        db.commit()
        response = await send_otp(data.email, random_otp)
    except Exception as e:
        print(e)
        return {"message" : "Error Occured"}
        
    return {"message" : response}

@router.post("/verify")
async def verify(verification_data : OTP_verification, db : Session = Depends(get_db)):
    otp_entry = db.query(OTP_entry).filter_by(email=verification_data.email, otp=verification_data.otp).order_by(OTP_entry.creation_time.desc()).first()
    if not otp_entry:
        raise HTTPException(status_code=401, detail="Invalid OTP")
    if (otp_entry.expiry_time).replace(tzinfo=timezone.utc) < (datetime.now(timezone.utc)):
        raise HTTPException(status_code=401, detail="OTP expired")
    return {"message":"Successful"}

