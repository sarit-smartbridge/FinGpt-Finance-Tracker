# FinGPT Finance Tracker

Personal finance tracker with a Vite React client and an Express/MongoDB server.

## Run Server

```powershell
cd server/server
npm install
copy .env.example .env
npm start
```

Server runs at `http://localhost:5100`.

Configure `server/server/.env` with `MONGO_URI`, `GEMINI_API_KEY`, and `GEMINI_MODEL`.

## Run Client

```powershell
cd client/client
npm install
npm start
```

Client runs at `http://localhost:3000`.
