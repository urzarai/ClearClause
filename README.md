git add .
git commit -m "Day 10: Production fixes — CORS, axios baseURL, Vercel SPA rewrite, README"
git push origin main
```

---

### Phase 2 — Render (Backend) Setup

1. Go to **render.com** → New → **Web Service**
2. Connect your GitHub repo
3. Fill in settings **exactly**:

| Setting | Value |
|---|---|
| **Name** | `clearclause-api` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

4. Under **Environment Variables** add all of these before clicking deploy:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | your Atlas URI |
| `JWT_SECRET` | any long random string |
| `GROQ_API_KEY` | your Groq key |
| `CLIENT_ORIGIN` | leave blank for now — fill after Vercel gives you a URL |

5. Click **Deploy**. Wait for logs to show:
```
Server running on http://localhost:10000
MongoDB connected: ...