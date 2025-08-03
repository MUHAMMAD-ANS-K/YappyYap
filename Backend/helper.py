from database import Base, engine, session, Email_signin, Email_signup, OTP_entry, Users, OTP_verification, SignUp_verification

Base.metadata.create_all(bind=engine)
db = session()
db.query(Users).delete()
db.query(OTP_entry).delete()
db.commit()
OTP_entry.__table__.drop(engine)
db.close()