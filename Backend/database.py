from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta, timezone
import psycopg2
import os
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr

load_dotenv()
DB_URL = os.getenv("DB_URL")
engine = create_engine(DB_URL)
Base = declarative_base()
session = sessionmaker(bind=engine)

class Users(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, index=True)
    email = Column(String, index=True)

class Pending_users(Base):
    __tablename__ = "pending_users"

    username = Column(String, primary_key=True, index=True)
    email = Column(String, index=True)


class OTP_entry(Base):
    __tablename__ = "otps"

    @staticmethod
    def get_expiry_time():
        return datetime.now(timezone.utc) + timedelta(minutes=4)
    @staticmethod
    def get_current_time():
        return datetime.now(timezone.utc)
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    otp = Column(String)
    creation_time = Column(DateTime(timezone=True), default=get_current_time)
    expiry_time = Column(DateTime(timezone=True), default=get_expiry_time)

class Guests(Base):
    __tablename__ = "guests"
    id = Column(Integer, primary_key=True)
    username = Column(String, index=True)

class Admins(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)

class Msgs(Base):
    __tablename__ = "msgs"
    @staticmethod
    def get_expiry(seconds : int):
        return datetime.now(timezone.utc) + timedelta(seconds=seconds)
    id = Column(Integer, primary_key=True)
    msg = Column(String)
    username = Column(String)
    time_sent = Column(DateTime(timezone=True))
    expiry = Column(DateTime(timezone=True))

class Msg_return(BaseModel):
    # id : int | str
    msg : str
    username : str
    time_sent : datetime | str
    expiry : datetime | str
    model_config = {
        "from_attributes" : True
    }

class Email_signin(BaseModel):
    email: EmailStr

class Email_signup(Email_signin):
    username:str

class OTP_verification(Email_signin):
    otp : str

class Guest_login(BaseModel):
    username: str