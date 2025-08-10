from database import Base, engine, session, Guest_login, Email_signin, Email_signup, OTP_entry, Users, OTP_verification, Pending_users, Guests
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, status
from send_email import send_otp
import random
import jwt
import os
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from typing import Annotated
load_dotenv()
router = APIRouter()

Base.metadata.create_all(bind=engine)
ALGORITHM = "HS256"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
async def verifyToken(session_token: Annotated[str | None, Cookie()] = None):
    if not session_token:
        return {"message": "No Session Active"}
    try:
        payload = jwt.decode(session_token, PRIVATE_KEY, ALGORITHM)
        print(payload)
        if not payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=[{"msg": "Invalid Token"}])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=[{"msg": "Invalid Token"}])
    return {"message" : "Success"}

@router.post("/signup") 
async def signup(data : Email_signup, db : Session = Depends(get_db)):
    random_otp = str(random.randint(10, 99)) + chr(65 + random.randint(0, 26)) + str(random.randint(10, 99)) + chr(65 + random.randint(0, 26))
    already_exists = db.query(Users).filter_by(email=data.email).first()
    if already_exists:
        raise HTTPException(status_code=400, detail=[{"msg":"Account already exists"}])
    already_exists = db.query(Users).filter_by(username=data.username).first()
    if already_exists:
        raise HTTPException(status_code=400, detail=[{"msg":"User name already taken"}])
    already_exists = db.query(Pending_users).filter_by(email = data.email).update({"username" : data.username})
    if already_exists == 0:
        pending_user_data = Pending_users(
            username = data.username,
            email = data.email
        )
        db.add(pending_user_data)
    try:
        response = await send_otp(data.email, random_otp)
        already_exists = db.query(OTP_entry).filter_by(email = data.email).update({"otp":random_otp})
        if already_exists == 0:
            data_for_dbadd = OTP_entry(
                email = data.email,
                username = data.username,
                otp = random_otp
            )
            db.add(data_for_dbadd)
        db.commit()
    except Exception as e:
        print(e)
        return {"message" : "Error Occured"}
    return {"message" : "Success"}

@router.post("/signin") 
async def signin(data : Email_signin, db : Session = Depends(get_db)):
    random_otp = str(random.randint(10, 99)) + chr(65 + random.randint(0, 26)) + str(random.randint(10, 99)) + chr(65 + random.randint(0, 26))
    user = db.query(Users).filter_by(email = data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail=[{"msg":"User Not Found"}])
    already_exists = db.query(OTP_entry).filter_by(email = data.email).update({"otp":random_otp})
    if already_exists == 0:
        data_for_dbadd = OTP_entry(
            email = data.email,
            username = user.username,
            otp = random_otp
        )
        db.add(data_for_dbadd)
    try:
        db.commit()
        response = await send_otp(data.email, random_otp)
    except Exception as e:
        print(e)
        return {"message" : "Error Occured"}
        
    return {"message" : "Success"}

async def createToken(data:dict):
    expires = datetime.now(timezone.utc) + timedelta(minutes=30)
    dummy_data = data.copy()
    dummy_data.update({"expires": str(expires)})
    token = jwt.encode(dummy_data, PRIVATE_KEY, algorithm=ALGORITHM)
    return token

@router.post("/acc-verify")
async def verify(verification_data : OTP_verification, response: Response, db : Session = Depends(get_db)):
    otp_entry = db.query(OTP_entry).filter_by(email=verification_data.email, otp=verification_data.otp).order_by(OTP_entry.creation_time.desc()).first()
    if not otp_entry:
        raise HTTPException(status_code=401, detail=[{"msg":"Invalid OTP"}])
    if otp_entry.expiry_time < (datetime.now(timezone.utc)):
        raise HTTPException(status_code=401, detail=[{"msg":"OTP expired"}])
    user = db.query(Users).filter_by(email = verification_data.email).first()
    token = await createToken({"user":user.username})
    response.set_cookie(
        key="session_token",
        value = token,
        httponly = True,
        secure = True,
        samesite = "none",
        max_age=1800
        )
    db.delete(otp_entry)
    db.commit()
    return {"message":"Successful"}

@router.post("/acc-create")
async def acc_create(verification_data : OTP_verification, response: Response, db : Session = Depends(get_db)):
    otp_entry = db.query(OTP_entry).filter_by(email=verification_data.email, otp=verification_data.otp).first()
    if not otp_entry:
        raise HTTPException(status_code=401, detail=[{"msg":"Invalid OTP"}])
    if otp_entry.expiry_time < (datetime.now(timezone.utc)):
        raise HTTPException(status_code=401, detail=[{"msg":"OTP expired"}])
    pending_user = db.query(Pending_users).filter_by(email = verification_data.email).first()
    user = Users(
        username = pending_user.username,
        email = pending_user.email, 
    )
    db.add(user)
    db.delete(otp_entry)
    db.delete(pending_user)
    db.commit()
    token = await createToken({pending_user.username})
    response.set_cookie(
        key="session_token",
        value=token,
        httponly = True,
        secure = True,
        samesite="none",
        max_age=1800
    )
    return {"message":"Success", "username" : user.username, "user" : "email"}

@router.get("/prelogin")
async def prelogin(message = Depends(verifyToken)):
    return message
    
@router.post("/guestlogin")
async def guest_login(request: Guest_login, response: Response, db : Session = Depends(get_db)):
    already_exists = db.query(Users).filter(username = request.username).first()
    if already_exists:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=[{"msg" : "Username already taken"}])
    already_exists = db.query(Guests).filter(username = request.username).first()
    if already_exists:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=[{"msg" : "Username already taken"}])
    guest_data = Guests(
        username = request.username
    )
    db.add(guest_data)
    db.commit()
    token = await createToken
    response.set_cookie(
        key="session_token",
        value = token,
        httponly = True,
        secure = True,
        samesite="none",
        max_age=1800
    )
    return {"msg" : "success", "username" : request.username}
    
@router.get("/signout")
async def signout(response: Response):
    response.delete_cookie(key="session_token")
    return {"msg" : "success"}

@router.get("/signoutguest")
async def guest_logout(request: Guest_login, response : Response, db : Session= Depends(get_db)):
    response.delete_cookie(key="session_token")
    del_user_signout = db.query(Guests).filter(username = request.username).first()
    db.delete(del_user_signout)
    db.commit()
    return {"msg" : "success"}
     