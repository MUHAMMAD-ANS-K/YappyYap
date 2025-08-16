from database import Base, engine, session, Email_signin, Email_signup, OTP_entry, Users,Pending_users, Msgs

Base.metadata.create_all(bind=engine)
db = session()
# db.query(Users).delete()
# db.query(OTP_entry).delete()
# db.commit()
# OTP_entry.__table__.drop(engine)
# Users.__table__.drop(engine)
# Pending_users.__table__.drop(engine)
Msgs.__table__.drop(engine)
db.close()
# from datetime import datetime, timezone

# print(datetime.now(timezone.utc))