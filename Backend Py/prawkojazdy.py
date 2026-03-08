import psycopg
from psycopg_pool import ConnectionPool
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Header
from fastapi import Request
from zoneinfo import ZoneInfo
from psycopg.errors import UniqueViolation
from psycopg import OperationalError, InterfaceError, DatabaseError, Error
from fastapi import HTTPException, Depends
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
import smtplib
from email.message import EmailMessage
import secrets


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

API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise HTTPException(status_code=401, detail="Brak API_KEY w env")

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Brak autoryzacji")

app = FastAPI(lifespan=lifespan,dependencies=[Depends(verify_api_key)])

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

def generateCode():
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    code = "".join(secrets.choice(alphabet) for _ in range (10))
    return code

polish_time = datetime.now(ZoneInfo("Europe/Warsaw")).replace(tzinfo=None)

@app.post("/register")
def register(data : dict):
    clientid = data["clientid"]
    password = data["password"]
    code = data["code"]
    password_hash = hash_password(password)
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Select code_hash from dane_logowania where client_id =%s and wygasniecie_kodu >= NOW()", (clientid,))
                results = cur.fetchone()
                if (results == None):
                    return {"Msg" : "Niepoprawne dane lub kod wygasł"}
                code_hash = results[0]
                if (not(verify_password(code, code_hash))):
                    return {"Msg" : "Niepoprawny kod"}
                cur.execute("Update dane_logowania Set password_hash = %s, wygasniecie_kodu = NOW() where client_id = %s", (password_hash, clientid))
                conn.commit()
    except Exception as e:
        logger.exception("Error in /register clientid=%s", clientid)
        conn.rollback()
        error_db(e)
    return {"Msg" : "Wprowadzono zmiany pomyślnie"}

@app.post("/login")
def login(data : dict):
     clientid = data["clientid"]
     password = data["password"]
     try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                  cur.execute("""Select dl."password_hash", dl."Rola" from dane_logowania dl where client_id = %s""", (clientid,))
                  row = cur.fetchone()
            if row is None:
                  return {"Msg":"Użytkownik nie istnieje"}
            stored_hash = row[0]
            if not verify_password(password, stored_hash):
                  return {"Msg":"Niepoprawne hasło"}
            return {"Msg": "Logowanie pomyślne","Rola":row[1]}
     except Exception as e:
        logger.exception("Error in /login clientid=%s", clientid)
        error_db(e)

@app.post("/editBookings")
def editBookings(data : dict):
     tabela_dat = data["data"]
     clientid = data["clientid"]
     try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""Update kalendarz Set zajete = TRUE, clientid = %s, status = 'PLANNED' where data = ANY(%s) and zajete = FALSE""", (clientid,tabela_dat))
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
    clientid = data["clientid"]
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Select data, zajete From kalendarz where data::date = %s", (data_,))
                rows = cur.fetchall()
                cur.execute("Select SUM(liczba_godzin) from faktury where clientid = %s and paid = True",(clientid,))
                sum = cur.fetchone()
                print(sum)
            return {"Msg": [{"data": dt.strftime("%Y-%m-%d %H:%M:%S"),"status": "available" if not zajete else "booked"}for dt, zajete in rows], "AvailableHours":sum[0]}
    except Exception as e:
        error_db(e)

@app.post("/getExam")
def getExam(request : Request):
    try:
        with pool.connection() as conn:
            with conn.cursor(row_factory = dict_row) as cur:
                cur.execute("Select lp,pytanie,odpowiedź_a,odpowiedź_b,odpowiedź_c, poprawna_odp, media, liczba_punktów, zakres_struktury from pytaniaegzaminacyjne where czykatb = TRUE")
                rows = cur.fetchall()
    except Exception as e:
        error_db(e)

    df = pd.DataFrame(rows)
    df1 = df[df["zakres_struktury"] == "PODSTAWOWY"]
    df1 = df1[["lp","pytanie", "poprawna_odp", "media", "liczba_punktów"]]
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

@app.post("/getExamsResults")
def getExamResults(data : dict):
    clientid = data["clientId"]
    try:
        with pool.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("Select id, data_egzaminu, liczba_punktow from wyniki_egzaminow where clientid = %s order by data_egzaminu desc limit 30", (clientid,))
                rows = cur.fetchall()
    except Exception as e:
        error_db(e)
    df1 = pd.DataFrame(rows)
    df1["data_egzaminu"] = pd.to_datetime(df1["data_egzaminu"])
    df1["data_egzaminu"] = df1["data_egzaminu"].astype("str")
    return {"Exams": df1.to_dict(orient="records")}

@app.post("/saveExamResults")
def saveExamResults(data:dict):
    clientid = data["clientId"]
    data_egzaminu = data["data_egzaminu"]
    uzyskane_punkty = data["uzyskane_punkty"]
    udzielone_odpowiedzi = data["odpowiedzi"]
    if (len(udzielone_odpowiedzi) != 32):
        return {"Msg": "Nie przesłano wszystkich pytań"}
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Insert Into wyniki_egzaminow (clientid, data_egzaminu, liczba_punktow) Values (%s, %s, %s) RETURNING id", (clientid, data_egzaminu, uzyskane_punkty))
                id = cur.fetchone()[0]
                data = [(id,odp["lp"], odp["udzielona_odp"]) for odp in udzielone_odpowiedzi]
                cur.executemany("Insert Into wyniki_egzaminow_pytania Values (%s,%s,%s)", data)
            conn.commit()
            return {"Msg" : "Zapis egzaminu pomyślny"}
    except Exception as e:
        conn.rollback()
        error_db(e)

@app.post("/getExamQuestions")
def getExamQuestions(data:dict):
    id_egzaminu = data["id"]
    try:
        with pool.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""Select pe."pytanie",pe."odpowiedź_a",pe."odpowiedź_b",pe."odpowiedź_c",pe."poprawna_odp",pe."media",pe."liczba_punktów",pe."zakres_struktury",wep."udzielona_odp",pe."wyjasnienie" from wyniki_egzaminow_pytania wep left join pytaniaegzaminacyjne pe on wep."lp_pytania" = pe."lp" where wep."id_egzaminu" = %s order by wep."id_pytania" """,(id_egzaminu,))
                rows = cur.fetchall()
    except Exception as e:
        error_db(e)
    df1 = pd.DataFrame(rows)
    df2 = df1[df1["zakres_struktury"] == "PODSTAWOWY"]
    df2 = df2.drop(columns=["odpowiedź_a","odpowiedź_b","odpowiedź_c","zakres_struktury"])
    df2["wyjasnienie"] = df2["wyjasnienie"].where(pd.notnull, "NI MA NIC")
    df3 = df1[df1["zakres_struktury"] == "SPECJALISTYCZNY"]
    df3 = df3.drop(columns=["zakres_struktury"])
    df3["wyjasnienie"]=df3["wyjasnienie"].where(pd.notnull, "NI MA NIC")
    return {"podstawowe":[df2.to_dict(orient="records")], "specjalistyczne":[df3.to_dict(orient="records")]}
@app.post("/addNewStudent")
def addNewStudent(data : dict):
    pkk, pesel,imie, nazwisko, rola, mail = data["pkk"], data["pesel"], data["imie"], data["nazwisko"], data["rola"], data["mail"]
    code = generateCode()
    code_hash = hash_password(code)
    data_wygasniecia = pd.Timestamp.now() + pd.Timedelta(hours=24)
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""Insert into dane_logowania (client_id, code_hash,"Rola",imie,nazwisko,pesel,wygasniecie_kodu, created_at, mail ) Values(%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                             (pkk,code_hash,rola,imie,nazwisko,pesel,data_wygasniecia,polish_time, mail))
                conn.commit()
    except UniqueViolation:
        conn.rollback()
        return {"Msg":"Użytkownik o podanym PKK już istnieje"}
    except Exception as e:
        conn.rollback()
        error_db(e)
    if(len(mail)==0):
        return {"Msg" : "Nie wysłano maila z powodu braku jego podania"}
    msg = EmailMessage()
    msg["From"] = "SuperSzkola@poczta.com"
    msg["To"] = mail
    msg["Subject"] = "Masz hasło"
    msg.set_content(f"Twoje hasło to: {code}. Ważne będzie przez 24h")
    with smtplib.SMTP("localhost", 1025) as smtp:
        smtp.send_message(msg)
    return {"Msg":"Mail wysłany"}
@app.post("/displayStudents")
def displayStudents(data : dict):
    strona = data["od"]
    limit = 50
    offset = (strona - 1) * limit
    try:
        with pool.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""Select client_id, "Rola", imie, nazwisko, pesel, wygasniecie_kodu from dane_logowania order by created_at desc limit 50 offset %s""",(offset,))
                rows = cur.fetchall()
    except Exception as e:
        error_db(e)
    df1 = pd.DataFrame(rows)
    df1['wygasniecie_kodu'] = df1['wygasniecie_kodu'].astype("str")
    df1["wygasniecie_kodu"] = df1["wygasniecie_kodu"].replace("T", " ")
    df1 = df1.fillna('')
    return {"students" : [df1.to_dict(orient="records")]}
@app.post("/editStudent")
def  editStudent(data : dict):
    clientid, rola, imie, nazwisko, pesel= data["clientid"], data["Rola"], data["imie"], data["nazwisko"], data["pesel"]
    new_clientid = data.get("newclientid", "")
    if len(new_clientid) == 0:
        new_clientid = clientid
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""Update dane_logowania Set client_id = %s, "Rola" = %s,imie = %s, nazwisko = %s, pesel = %s where client_id = %s """,(new_clientid,rola, imie, nazwisko, pesel, clientid))
                updated_rows = cur.rowcount
                conn.commit()
    except Exception as e:
        error_db(e)
    if updated_rows > 0:
        return {"Msg" : "wprowadzono zmiany pomyślnie"}
    else:
        return {"Msg" : "Brak tego klienta"}
@app.post("/generateNewCode")
def generateNewCode(data : dict):
    code = generateCode()
    code_hash = hash_password(code)
    clientid = data["clientid"]
    data_wygasniecia = polish_time + pd.Timedelta(hours=24)
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""Update dane_logowania Set code_hash = %s, wygasniecie_kodu = %s where client_id = %s RETURNING mail""",(code_hash, data_wygasniecia, clientid))
                results = cur.fetchone()
            conn.commit()
    except Exception as e:
        error_db(e)
    if(len(results) == 0):
        return {"Msg":"Nie wysłano maila z powodu braku jego podania"}
    mail = results[0]
    msg = EmailMessage()
    msg["From"] = "SuperSzkola@poczta.com"
    msg["To"] = mail
    msg["Subject"] = "Masz hasło"
    msg.set_content(f"Twoje hasło to: {code}. Ważne będzie przez 24h")
    with smtplib.SMTP("localhost", 1025) as smtp:
        smtp.send_message(msg)
    return {"Msg":"Mail wysłany"}

@app.post("/getStudentsLessons")
def getStudentsLessons(data:dict):
    clientid = data["clientid"]
    try:
        with pool.connection() as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""Select data, status from kalendarz where clientid = %s order by data desc""", (clientid,))
                rows = cur.fetchall()
                cur.execute("Select SUM(liczba_godzin) from faktury where clientid = %s and paid = True",(clientid,))
                sum = cur.fetchone()
    except Exception as e:
        error_db(e)
    df = pd.DataFrame(rows)
    df2 = df
    df2 = df2[df2["status"] == "FINISHED"]
    df["data"] = df["data"].astype('str')
    df["data"] = df["data"].replace('T', ' ')
    return {"Lessons":df.to_dict(orient='records'), "FinishedLessons":len(df2), "AvailableHours" : sum["sum"]}
@app.post("/newInvoice")
def newInvoice(data:dict):
    clientid,liczba_godzin,kwota_za_h = data["clientid"], data["liczba_godzin"], data["kwota_za_h"]
    kwota_do_zaplaty = liczba_godzin * kwota_za_h
    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("Select COUNT(*) from dane_logowania where client_id = %s", (clientid,))
                if(cur.fetchone()[0] == 0):
                    return {"Msg" : "Podany klient nie istnieje"}
                cur.execute("Insert into faktury (clientid, liczba_godzin, kwota_do_zaplaty, created_at, paid) Values(%s,%s,%s,%s, FALSE)",(clientid, liczba_godzin, kwota_do_zaplaty, polish_time))
                conn.commit()
    except Exception as e:
        conn.rollback()
        error_db(e)
    return {"Msg" : "Faktura dodana pomyślnie"}
if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)