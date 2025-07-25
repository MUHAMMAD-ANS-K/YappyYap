from pydantic import BaseModel, EmailStr

class Email_req(BaseModel):
    email: EmailStr

class OTP_veriication(Email_req):
    otp : str