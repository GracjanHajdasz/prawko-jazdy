import psycopg
from psycopg_pool import ConnectionPool
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from zoneinfo import ZoneInfo
from psycopg.errors import UniqueViolation
from psycopg import OperationalError, InterfaceError, DatabaseError, Error
from fastapi import HTTPException
from passlib.context import CryptContext
import os, sys
from pathlib import Path
from dotenv import load_dotenv
import uvicorn
import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger("prawkojazdy")

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
def base_dir():
    return Path(sys.executable).resolve().parent if getattr(sys, "frozen", False) else Path(__file__).resolve().parent
load_dotenv(base_dir() / ".env", override=True)
DATABASE_URL = os.getenv("DATABASE_URL")
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))

if not DATABASE_URL:
    raise RuntimeError("Brak DATABASE_URL. Dodaj plik .env")
pool = ConnectionPool(conninfo = DATABASE_URL, min_size=1, max_size=10, timeout=10)
@asynccontextmanager
async def lifespan(app:FastAPI):
    logger.info("API startup - opening DB pool")
    pool.open()
    yield
    logger.info("API startup - closing DB pool")
    pool.close()
app = FastAPI(lifespan=lifespan)
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)
def error_db(error : Exception):
      if isinstance(error,(OperationalError, InterfaceError)):
            raise HTTPException(status_code=503, detail = "Baza danych niedostępna")
      elif isinstance(error, DatabaseError):
            raise HTTPException(status_code=500, detail=f"Błąd bazy danych: {error.__class__.__name__}")
      raise HTTPException(status_code=500, detail="Nieznany błąd serwera")
@app.post("/register")
def register(data : dict):
    clientid = data["clientid"]
    password = data["password"]
    password_hash = hash_password(password)
    polish_time = datetime.now(ZoneInfo("Europe/Warsaw")).replace(tzinfo=None)
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Insert Into dane_logowania (client_id,password_hash,created_at) Values (%s, %s, %s)", (clientid,password_hash,polish_time))
            conn.commit()
            return {"Msg": "Rejestracja pomyślna"}
    except UniqueViolation:
        conn.rollback()
        return {"Msg": "Użytkownik już istnieje"}
    except Exception as e:
        logger.exception("Error in /register clientid=%s", clientid)
        conn.rollback()
        error_db(e)
@app.post("/login")
def login(data : dict):
     clientid = data["clientid"]
     password = data["password"]
     try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                  cur.execute("Select password_hash from dane_logowania where client_id = %s", (clientid,))
                  row = cur.fetchone()
            if row is None:
                  return {"Msg":"Użytkownik nie istnieje"}
            stored_hash = row[0]
            if not verify_password(password, stored_hash):
                  return {"Msg":"Niepoprawne hasło"}
            return {"Msg": "Logowanie pomyślne"}
     except Exception as e:
        logger.exception("Error in /login clientid=%s", clientid)
        error_db(e)
@app.post("/editBookings")
def editBookings(data : dict):
     tabela_dat = data["data"]
     try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Update kalendarz Set zajete = TRUE where data = ANY(%s) and zajete = FALSE", (tabela_dat,))
                updated_rows = cur.rowcount
            if updated_rows == len(tabela_dat):
                conn.commit()
                return {"Msg": "Kursant zapisany"}
            else:
                conn.rollback()
                return {"Msg" : "Godziny zajete"}
     except Exception as e:
        conn.rollback()
        error_db(e)
@app.post("/getBookings")
def getBookings(data:dict):
    data_ = data["data"]
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Select data, zajete From kalendarz where data::date = %s", (data_,))
                rows = cur.fetchall()
            return {"Msg": [{"data": dt.strftime("%Y-%m-%d %H:%M:%S"),"status": "available" if not zajete else "booked"}for dt, zajete in rows]}
    except Exception as e:
        error_db(e)
if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)