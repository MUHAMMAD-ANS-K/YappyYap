from database import Base, engine, session, Email_signin, Email_signup, OTP_entry, Users, OTP_verification, Pending_users
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

@router.post("/signup") 
async def otpsend(data : Email_signup, db : Session = Depends(get_db)):
    random_otp = str(random.randint(10, 99)) + chr(65 + random.randint(0, 26)) + str(random.randint(10, 99)) + chr(65 + random.randint(0, 26))
    already_exists = db.query(Users).filter_by(email=data.email).first()
    if already_exists:
        raise HTTPException(status_code=400, detail=[{"msg":"Account already exists"}])
    already_exists = db.query(Users).filter_by(user=data.username).first()
    if already_exists:
        raise HTTPException(status_code=400, detail=[{"msg":"User name already taken"}])
    already_exists = db.query(Pending_users).filter_by(email = data.email).update({"user" : data.username})
    if already_exists == 0:
        pending_user_data = Pending_users(
            user = data.username,
            email = data.email
        )
        db.add(pending_user_data)
    already_exists = db.query(OTP_entry).filter_by(email = data.email).update({"otp":random_otp})
    if already_exists == 0:
        data_for_dbadd = OTP_entry(
            email = data.email,
            user = data.username,
            otp = random_otp
        )
        db.add(data_for_dbadd)
    try:
        db.commit()
        response = await send_otp(data.email, random_otp)
    except Exception as e:
        print(e)
        return {"message" : "Error Occured"}
    return {"message" : "Successful"}

@router.post("/signin") 
async def otpsend(data : Email_signin, db : Session = Depends(get_db)):
    random_otp = str(random.randint(10, 99)) + chr(65 + random.randint(0, 26)) + str(random.randint(10, 99)) + chr(65 + random.randint(0, 26))
    username = db.query(Users).filter_by(email = data.email).first()
    if not username:
        raise HTTPException(status_code=404, detail=[{"msg":"User Not Found"}])
    already_exists = db.query(OTP_entry).filter_by(email = data.email).update({"otp":random_otp})
    if already_exists == 0:
        data_for_dbadd = OTP_entry(
            email = data.email,
            user = data.username,
            otp = random_otp
        )
        db.add(data_for_dbadd)
    try:
        db.commit()
        response = await send_otp(data.email, random_otp)
    except Exception as e:
        print(e)
        return {"message" : "Error Occured"}
        
    return {"message" : "Successful"}

@router.post("/acc-verify")
async def verify(verification_data : OTP_verification, db : Session = Depends(get_db)):
    otp_entry = db.query(OTP_entry).filter_by(email=verification_data.email, otp=verification_data.otp).order_by(OTP_entry.creation_time.desc()).first()
    if not otp_entry:
        raise HTTPException(status_code=401, detail=[{"msg":"Invalid OTP"}])
    if (otp_entry.expiry_time).replace(tzinfo=timezone.utc) < (datetime.now(timezone.utc)):
        raise HTTPException(status_code=401, detail=[{"msg":"OTP expired"}])
    return {"message":"Successful"}

@router.post("/acc-create")
async def acc_create(verification_data : OTP_verification, db : Session = Depends(get_db)):
    otp_entry = db.query(OTP_entry).filter_by(email=verification_data.email, otp=verification_data.otp).first()
    if not otp_entry:
        raise HTTPException(status_code=401, detail=[{"msg":"Invalid OTP"}])
    if (otp_entry.expiry_time).replace(tzinfo=timezone.utc) < (datetime.now(timezone.utc)):
        raise HTTPException(status_code=401, detail=[{"msg":"OTP expired"}])
    pending_user = db.query(Pending_users).filter_by(email = verification_data.email).first()
    user = Users(
        user = pending_user.user,
        email = pending_user.email, 
    )
    db.add(user)
    db.commit()
    return {"message":"Successful"}
