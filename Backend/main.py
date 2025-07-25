from database import Base, engine, session



Base.metadata.create_all(bind=engine)

def db_access():
    db = session()
    try:
        yield db
    finally:
        db.close()