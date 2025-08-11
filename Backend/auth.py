from database import Base, engine, session, Guest_login, Email_signin, Email_signup, OTP_entry, Users, OTP_verification, Pending_users, Guests
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, status
from send_email import send_otp
import random
import jwt
import os
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import time
from pydantic import BaseModel
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

async def create_session_token(data:dict):
    token = jwt.encode(data, PRIVATE_KEY, algorithm=ALGORITHM)
    return token

async def verify_session_token(session_token: Annotated[str | None, Cookie()] = None):
    if not session_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=[{"msg" : "No session found."}])
    try:
        payload = jwt.decode(session_token, PRIVATE_KEY, ALGORITHM)
        if not payload:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=[{"msg": "Invalid Token"}])
        if not payload.username:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=[{"msg": "Invalid Token"}])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=[{"msg": "Invalid Token"}])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=[{"msg" : "Expired Token"}])
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
        email_response = await send_otp(data.email, random_otp)
    except:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=[{"msg" : "Service not available. Try Again."}])
    already_exists = db.query(OTP_entry).filter_by(email = data.email).update({"otp":random_otp})
    if already_exists == 0:
        data_for_dbadd = OTP_entry(
            email = data.email,
            otp = random_otp
        )
        db.add(data_for_dbadd)
    db.commit()
    return {"msg" : "Success"}

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
    token = await create_session_token({"user": user.username, "exp" : int(time.time()) + 1800})
    response.set_cookie(
        key="session_token",
        value=token,
        httponly = True,
        secure = True,
        samesite="none",
        max_age=1800,
        path="/",
        domain=".muhammadans.com"
    )
    return {"msg":"Success", "username" : user.username, "user" : "email"}



@router.post("/signin") 
async def signin(data : Email_signin, db : Session = Depends(get_db)):
    random_otp = str(random.randint(10, 99)) + chr(65 + random.randint(0, 26)) + str(random.randint(10, 99)) + chr(65 + random.randint(0, 26))
    user = db.query(Users).filter_by(email = data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail=[{"msg":"User Not Found"}])
    already_exists = db.query(OTP_entry).filter_by(email = data.email).update({"otp":random_otp})
    try:
        email_response = await send_otp(data.email, random_otp)
    except:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=[{"msg" : "Service not available. Try Later."}])
    if already_exists == 0:
        data_for_dbadd = OTP_entry(
            email = data.email,
            username = user.username,
            otp = random_otp
        )
        db.add(data_for_dbadd)
    db.commit()
        
    return {"msg" : "Success"}

@router.post("/acc-verify")
async def verify(verification_data : OTP_verification, response: Response, db : Session = Depends(get_db)):
    otp_entry = db.query(OTP_entry).filter_by(email=verification_data.email, otp=verification_data.otp).order_by(OTP_entry.creation_time.desc()).first()
    if not otp_entry:
        raise HTTPException(status_code=401, detail=[{"msg":"Invalid OTP"}])
    if otp_entry.expiry_time < (datetime.now(timezone.utc)):
        raise HTTPException(status_code=401, detail=[{"msg":"OTP expired"}])
    user = db.query(Users).filter_by(email = verification_data.email).first()
    token = await create_session_token({"user":user.username, "exp" : int(time.time()) + 1800})
    response.set_cookie(
        key="session_token",
        value = token,
        httponly = True,
        secure = True,
        samesite = "none",
        max_age=1800,
        path="/",
        domain=".muhammadans.com"
        )
    db.delete(otp_entry)
    db.commit()
    return {"message":"Successful"}



@router.get("/logincheck")
async def logincheck(message = Depends(verify_session_token)):
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
    token = await create_session_token({"username" : guest_data.username, "exp": int(time.time()) + 300})
    response.set_cookie(
        key="session_token",
        value = token,
        httponly = True,
        secure = True,
        samesite="none",
        max_age=300,
        path="/",
        domain=".muhammadans.com"
    )
    return {"msg" : "success", "username" : request.username}
    
@router.get("/signout")
async def signout(response: Response):
    response.delete_cookie(key="session_token")
    return {"msg" : "success"}

@router.post("/delete")
async def delete_acc(request: Email_signin, response: Response, db: Session = Depends(get_db), msg = Depends(verify_session_token)):
    response.delete_cookie(key="session_token")
    del_user = db.query(Users).filter(email=request.email).first()
    db.delete(del_user)
    db.commit()
    return {"msg" : "Success"}

@router.post("/signoutguest")
async def guest_logout(request: Guest_login, response : Response, db : Session= Depends(get_db), msg = Depends(verify_session_token)):
    response.delete_cookie(key="session_token")
    del_user_signout = db.query(Guests).filter(username = request.username).first()
    db.delete(del_user_signout)
    db.commit()
    return {"msg" : "success"}