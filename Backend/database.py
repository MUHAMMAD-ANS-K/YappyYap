from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta, timezone
import psycopg2
import os
from dotenv import load_dotenv, find_dotenv
from pydantic import BaseModel, EmailStr

load_dotenv()
DB_URL = f"postgresql+psycopg2://{os.getenv("DB_USERNAME")}:{os.getenv("DB_PASS")}@localhost:5432/yappy"
engine = create_engine(DB_URL)
Base = declarative_base()
session = sessionmaker(bind=engine)

class OTP_enter(Base):
    __tablename__ = "otps"

    @staticmethod
    def get_expiry_time():
        return datetime.now(timezone.utc) + timedelta(minutes=4)
    
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)
    otp = Column(String)
    creation_time = Column(DateTime, default=datetime.now(timezone.utc))
    expiry_time = Column(DateTime, default=get_expiry_time)

class Email_req(BaseModel):
    email: EmailStr

class OTP_veriication(Email_req):
    otp : str
