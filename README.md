# 🚗 Prawko Jazdy

Aplikacja webowa do nauki i przygotowania do egzaminu na prawo jazdy.

## Architektura

```
Baza danych → Python → Node.js → React
```

- **Python** odpytuje bazę danych i wysyła dane do backendu Node.js
- **Node.js** pośredniczy między Pythonem a frontendem
- **React** wyświetla interfejs użytkownika

## Struktura projektu

```
prawko-jazdy/
├── frontend/       # Aplikacja React
├── backend/        # Serwer Node.js (API)
└── Backend Py/     # Skrypty Python (pobieranie danych z bazy)
```

## Wymagania

- Node.js
- Python 3.x
- npm / pip

## Konfiguracja

Skopiuj plik `.env` i uzupełnij zmienne środowiskowe:

```bash
cp .env.example .env
```

### Node.js (`backend/.env`)

```env
PORT=5000
PYTHON_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

### Python (`Backend Py/.env`)

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
HOST=127.0.0.1
PORT=8000
API_KEY=your_api_key
```

## Uruchomienie

### 1. Python (pobieranie danych z bazy)

```bash
cd "Backend Py"
pip install -r requirements.txt
python main.py
```

### 2. Backend Node.js

```bash
cd backend
npm install
npm start
```

### 3. Frontend React

```bash
cd frontend
npm install
npm start
```

## Technologie

- **Frontend:** React, JavaScript, CSS
- **Backend:** Node.js (port 5000)
- **Skrypty:** Python / FastAPI lub Flask (port 8000)
- **Baza danych:** PostgreSQL (Neon)
- **Autoryzacja:** JWT
- **Konfiguracja:** `.env`

## Testowe konto

Aby zalogować się i przetestować aplikację:

```
Login:    u1
Hasło:    p1
```
