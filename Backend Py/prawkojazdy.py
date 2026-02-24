import psycopg
from psycopg_pool import ConnectionPool
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from fastapi import Request
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
import pandas as pd
import random as rd
from psycopg.rows import dict_row
from fastapi.staticfiles import StaticFiles
from pathlib import Path

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

pool = ConnectionPool(conninfo = DATABASE_URL, min_size=1, max_size=10, timeout=10, max_idle=300, max_lifetime=1800)

@asynccontextmanager
async def lifespan(app:FastAPI):
    logger.info("API startup - opening DB pool")
    pool.open()
    yield
    logger.info("API startup - closing DB pool")
    pool.close()

app = FastAPI(lifespan=lifespan)

BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = BASE_DIR / "pytania_egzaminacyjne_2025"

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name = "media")

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

def retry(function):
    return function


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

@app.post("/getExam")
def getExam(request : Request):
    try:
        with pool.connection() as conn:
            with conn.cursor(row_factory = dict_row) as cur:
                cur.execute("Select pytanie,odpowiedź_a,odpowiedź_b,odpowiedź_c, poprawna_odp, media, liczba_punktów, zakres_struktury from pytaniaegzaminacyjne where czykatb = TRUE")
                rows = cur.fetchall()
    except Exception as e:
        error_db(e)

    df = pd.DataFrame(rows)
    df1 = df[df["zakres_struktury"] == "PODSTAWOWY"]
    df1 = df1[["pytanie", "poprawna_odp", "media", "liczba_punktów"]]
    PODSTAWOWE_3pkt = df1[df1["liczba_punktów"] == 3].sample(n=10)
    PODSTAWOWE_2pkt = df1[df1["liczba_punktów"] == 2].sample(n=6)
    PODSTAWOWE_1pkt = df1[df1["liczba_punktów"] == 1].sample(n=4)
    PODSTAWOWE = pd.concat([PODSTAWOWE_1pkt, PODSTAWOWE_2pkt,PODSTAWOWE_3pkt], ignore_index=True)
    base_url = str(request.base_url) + "media/"
    PODSTAWOWE["media"] =  base_url + PODSTAWOWE["media"].astype(str)
    PODSTAWOWE = PODSTAWOWE.sample(frac=1).reset_index(drop=True)

    df2 = df[df["zakres_struktury"] == "SPECJALISTYCZNY"]
    df2 = df2.drop(columns=["zakres_struktury"])
    SPECJALISTYCZNE_3pkt = df2[df2["liczba_punktów"] == 3].sample(n=6)
    SPECJALISTYCZNE_2pkt = df2[df2["liczba_punktów"] == 2].sample(n=4)
    SPECJALISTYCZNE_1pkt = df2[df2["liczba_punktów"] == 1].sample(n=2)
    SPECJALISTYCZNE = pd.concat([SPECJALISTYCZNE_1pkt,SPECJALISTYCZNE_2pkt,SPECJALISTYCZNE_3pkt], ignore_index=True)
    SPECJALISTYCZNE["media"] =  base_url + SPECJALISTYCZNE["media"].astype(str) 
    SPECJALISTYCZNE = SPECJALISTYCZNE.sample(frac=1).reset_index(drop=True)

    return {"podstawowe": PODSTAWOWE.to_dict(orient="records"),
            "specjalistyczne" : SPECJALISTYCZNE.to_dict(orient="records")
            }

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)