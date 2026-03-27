<div align="center">

# ⚖️ ClearClause

**AI-powered legal document simplifier for non-lawyers**

[Live Demo](https://your-vercel-url) · [Report a Bug](https://github.com/yourusername/clearclause/issues) · [Request a Feature](https://github.com/yourusername/clearclause/issues)

![ClearClause Landing Page](https://your-screenshot-url)

</div>

---

## What is ClearClause?

Legal documents are deliberately complex. Most people sign rent agreements, employment contracts, NDAs, and loan documents without truly understanding their rights or obligations.

ClearClause lets anyone upload a legal document and get back:
- A **plain English explanation** of every clause
- A **risk rating** (Low / Medium / High) for each clause with a reason
- An overall **safety score** from 0–100
- An **executive summary** of the entire document
- A **downloadable PDF report** of the full analysis

Built as a capstone project targeting the Indian market where legal literacy is low and professional consultation is expensive.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Component-based UI, fast dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| jsPDF + jspdf-autotable | Client-side PDF report generation |
| CSS Modules / CSS Variables | Theming, dark/light mode |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas + Mongoose | Cloud database, ODM |
| Multer | Multipart file upload handling |
| pdfjs-dist | PDF text extraction |
| natural.js | TF-IDF keyword scoring |
| Groq SDK (llama-3.3-70b) | Clause explanation and risk analysis |
| JWT + bcryptjs | Stateless auth, password hashing |

### Infrastructure
| Service | What runs on it |
|---|---|
| Vercel | React frontend |
| Render | Express backend |
| MongoDB Atlas M0 | Database (free tier) |
| Groq API | LLM inference (free tier) |

---

## Features

- **Document Upload** — Drag-and-drop or file picker, PDF and TXT, up to 5MB
- **NLP Pre-processing** — Clause segmentation, named entity recognition, keyword flagging
- **AI Analysis** — Every clause explained in plain English with risk level and reason
- **Safety Score** — 0–100 gauge: Safe (75+), Review Advised (50–74), High Risk (0–49)
- **Results UI** — Side-by-side original vs plain English, accordion cards, risk filters
- **PDF Report** — Branded downloadable report with full clause breakdown
- **Document History** — All past analyses saved, searchable, re-openable, deletable
- **Dark / Light Mode** — Full theme support across all pages including landing
- **Collapsing Sidebar** — Expands on hover, collapses to icon strip

---

## Project Structure
```
clearclause/
├── client/                     # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Configured Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── ClauseCard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SafetyGauge.jsx
│   │   │   ├── ScaleVisual.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Results.jsx
│   │   │   └── History.jsx
│   │   ├── utils/
│   │   │   └── generateReport.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vercel.json             # SPA rewrite rules
│   └── package.json
│
└── server/                     # Express backend
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   └── documentController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Document.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── documentRoutes.js
    ├── services/
    │   ├── groq/
    │   │   └── index.js        # Groq API, prompt engineering, batching
    │   └── nlp/
    │       ├── clauseExtractor.js
    │       ├── entityExtractor.js
    │       ├── keywordExtractor.js
    │       └── index.js
    ├── uploads/                # Temp storage — files deleted after processing
    │   └── .gitkeep
    ├── .env.example
    ├── index.js
    └── package.json
```

---

## Local Development

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free)
- Groq API key (free — console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/clearclause.git
cd clearclause
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/clearclause
JWT_SECRET=your_long_random_secret_here
GROQ_API_KEY=gsk_your_groq_key_here
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
MongoDB connected: your-cluster.mongodb.net
```

### 3. Frontend setup
```bash
cd ../client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register with name, email, password |
| POST | `/api/auth/login` | No | Login, returns JWT token |
| GET | `/api/auth/me` | Yes | Get current user |

### Documents

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/documents/upload` | Yes | Upload PDF/TXT, triggers NLP + AI analysis |
| GET | `/api/documents/history` | Yes | List all user's documents |
| GET | `/api/documents/:id` | Yes | Get full analysis for one document |
| DELETE | `/api/documents/:id` | Yes | Remove document from history |
| GET | `/api/health` | No | Health check |

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GROQ_API_KEY` | Groq API key from console.groq.com |
| `CLIENT_ORIGIN` | Frontend URL for CORS (e.g. https://yourapp.vercel.app) |

### Frontend (`client/.env.local` for local, Vercel dashboard for prod)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (e.g. https://clearclause-api.onrender.com) |

---

## Deployment

### Backend → Render

1. New Web Service → connect GitHub repo
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables from the table above
6. Deploy

### Frontend → Vercel

1. New Project → import GitHub repo
2. Root Directory: `client`
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add `VITE_API_URL` environment variable
7. Deploy

---

## Known Limitations

- **Scanned PDFs** — Image-only PDFs have no text layer and cannot be processed. A clear error message is shown.
- **Groq rate limits** — Free tier allows 30 requests/minute. Large documents (30 clauses) take ~90 seconds due to batching delays.
- **Render cold starts** — The free tier spins down after inactivity. First request after idle may take 30–60 seconds.
- **File size** — Maximum 5MB per upload. Most legal documents are well under this limit.

---

## Disclaimer

> This application and any analysis it produces is for informational and educational purposes only. It does not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified legal professional.

---

## License

MIT © 2025 [Urza Rai](https://github.com/urzarai)