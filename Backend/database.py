from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta, timezone
import psycopg2
import os
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr

load_dotenv()
DB_URL = f"postgresql+psycopg2://{os.getenv("DB_USERNAME")}:{os.getenv("DB_PASS")}@localhost:5432/yappy"
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
    
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    username = Column(String)
    otp = Column(String)
    creation_time = Column(DateTime, default=datetime.now(timezone.utc))
    expiry_time = Column(DateTime, default=get_expiry_time)

class Guests(Base):
    __tablename__ = "guests"
    id = Column(Integer, primary_key=True)
    username = Column(String, index=True)

class Email_signin(BaseModel):
    email: EmailStr

class Email_signup(Email_signin):
    username:str

class OTP_verification(Email_signin):
    otp : str
class SignUp_verification(Email_signup):
    otp : str

class Guest_login(BaseModel):
    username: str