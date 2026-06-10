# Aura3.0 — Mental Health Companion (Backend)

Summary
-------
This repository contains the backend server for Aura3.0, a lightweight mental-health companion backend built with Node.js and Express. It provides user authentication, conversation support powered by a Gemini-style generative API, persistent storage of user interactions (vibe checks, chat history, moods, meditation sessions, and activity tracking), and real-time chat via Socket.IO.

Key features
- User registration & login (JWT + bcrypt)
- AI chat endpoint that calls a Gemini generative API with fallback responses
- Save and retrieve: vibe checks, chat history, meditation sessions, moods, user activities
- Dashboard statistics endpoint
- Socket.IO real-time chat support
- Health-check endpoint

Tech stack
- Node.js (CommonJS)
- Express
- MongoDB + Mongoose
- Socket.IO
- bcryptjs, jsonwebtoken
- dotenv for configuration

Environment variables
- `MONGO_URI` — MongoDB connection string (defaults to `mongodb://127.0.0.1:27017/aura3`)
- `JWT_SECRET` — secret for signing JWTs
- `GEMINI_API_KEY` — API key for the Gemini generative API
- `PORT` — port to run the server (default: `5000`)

Setup
-----
1. Install Node.js (recommended v18+).
2. In the backend folder, install dependencies:

```bash
cd "mental health care/backend"
npm install
```

3. Create a `.env` file in the same folder with values for at least `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` (do not commit this file):

```
MONGO_URI=mongodb://127.0.0.1:27017/aura3
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

4. Start the server:

```bash
npm start
# or for development (if nodemon is installed globally):
npx nodemon server.js
```

API Endpoints (summary)
- `POST /api/register` — register new user (body: `name`, `email`, `password`)
- `POST /api/login` — login (body: `email`, `password`) → returns JWT
- `GET /api/auth/user` — get user profile (requires `x-auth-token` header)
- `POST /api/chat` — send message to AI (body: `message`) → returns reply
- `POST /api/vibe-check` — save a vibe check (auth required)
- `POST /api/chat-history` — save chat message (auth required)
- `POST /api/meditation` — save meditation session (auth required)
- `POST /api/moods` — save mood entry (auth required)
- `POST /api/activity` — track user activity (auth required)
- `POST /api/save-data` — generic save route for multiple collections (auth required)
- `GET /api/dashboard/stats` — dashboard metrics (auth required)
- `GET /api/health` — health and status

Security & Notes
- Keep `GEMINI_API_KEY` and `JWT_SECRET` secret; do not commit `.env` to version control.
- The server includes a local `getFallbackResponse` to handle critical cases (e.g., suicidal ideation) — ensure proper crisis resources are configured for your region.
- The included Gemini API usage in `server.js` uses `node-fetch` and a public example key; replace with a proper key and review rate limits and pricing before production.

License
- ISC (see `backend/package.json`)

Next steps
- Add README sections for frontend integration and example curl commands if desired.
