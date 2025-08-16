from datetime import datetime, timezone
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from database import session, Msgs
from sqlalchemy import delete
import sys
import signal
from pytz import utc
def del_job():
    db = session()
    db.execute(delete(Msgs).where(Msgs.expiry < datetime.now(timezone.utc)))
    db.commit()
    db.close()
    print("ji")

executors = {
    "default" : ThreadPoolExecutor(1)
}

def shutdown(signum, frame):
    print("stopping..")
    scheduler.shutdown(wait=True)
    sys.exit(0)
signal.signal(signal.SIGINT, shutdown)
signal.signal(signal.SIGTERM, shutdown)

scheduler = BlockingScheduler(executors=executors, timezone=utc)
scheduler.add_job(del_job, 'interval', seconds=10)
try:
    scheduler.start()
except (KeyboardInterrupt, SystemExit):
    print("stoping vro..")