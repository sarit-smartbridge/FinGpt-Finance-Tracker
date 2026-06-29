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

## Deploy

### Backend: Render

Create a Render Web Service from this repository.

```text
Root Directory: server/server
Build Command: npm install
Start Command: npm start
```

Set these Render environment variables:

```text
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=your_random_secret
```

Render can also use the root `render.yaml` blueprint.

### Frontend: Vercel

Create a Vercel project from this repository.

```text
Root Directory: client/client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Set this Vercel environment variable after the backend is deployed:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

Redeploy the frontend after setting `VITE_API_URL`.
