# 🎬 IMDb US Top 10 Movies — Box Office Dashboard

A full-stack, premium dashboard that scrapes the IMDb US Top Box Office page and displays it in a cinematic, futuristic UI. Designed with Apple × Linear × Vercel aesthetics.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS + custom glassmorphism |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Scraping** | Axios + Cheerio |
| **Scheduling** | node-cron (auto 30-min refresh) |

---

## 📁 Folder Structure

```
imdb-dashboard/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── MoviesTable.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── DatabaseView.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                    # Node.js + Express backend
    ├── controllers/
    │   └── movieController.js
    ├── routes/
    │   └── movieRoutes.js
    ├── models/
    │   └── Movie.js
    ├── scraper/
    │   └── imdbScraper.js
    ├── index.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone and install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/imdb_dashboard
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/imdb_dashboard
```

### 3. Run in development

```bash
# Terminal 1 — Start MongoDB (if local)
mongod

# Terminal 2 — Start backend
cd server && npm run dev

# Terminal 3 — Start frontend
cd client && npm run dev
```

Open: http://localhost:5173

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/movies` | Get all movies from DB |
| `GET` | `/api/movies/scrape` | Scrape IMDb + save/update DB |
| `POST` | `/api/movies/refresh` | Clear DB + fresh scrape |
| `GET` | `/api/movies/:id` | Get single movie by MongoDB ID |
| `GET` | `/api/health` | Server + DB health check |

---

## 🗄 Database Schema

```js
{
  rank: Number,          // 1–10 box office position
  title: String,         // Movie title
  weekendGross: String,  // e.g. "$154.2M"
  totalGross: String,    // e.g. "$498.9M"
  weeks: Number,         // Weeks in theatrical release
  imdbUrl: String,       // Full IMDb title URL
  poster: String,        // Poster image URL
  createdAt: Date,       // First inserted
  updatedAt: Date        // Last modified
}
```

---

## ✨ Features

- **Live Scraping** — Cheerio + Axios scrape IMDb on demand with graceful fallback to demo data
- **Auto-refresh** — node-cron refreshes every 30 minutes automatically
- **Dark/Light mode** — Toggle in header
- **Responsive** — Mobile-first with a collapsible sidebar
- **PWA-ready** — manifest.json included
- **Search & Sort** — Instant client-side filtering + column sort
- **Export CSV** — Download all data as CSV
- **Copy links** — One-click IMDb URL copy
- **Analytics** — Bar, area, and progress charts via Recharts
- **Skeleton loading** — Shimmer placeholders while fetching

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Deploy the `dist/` folder to Vercel
# Set VITE_API_URL=https://your-backend.onrender.com/api in Vercel env vars
```

### Backend → Render / Railway

1. Push `server/` to GitHub
2. Create a new Web Service on Render pointing to the repo
3. Set env var: `MONGO_URI=mongodb+srv://...`
4. Build command: `npm install`
5. Start command: `node index.js`

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#080811` (deep space) |
| Surface | `rgba(255,255,255,0.03)` glassmorphism |
| Neon Yellow | `#F5C518` (IMDb gold) |
| Neon Orange | `#FF6B2B` |
| Neon Purple | `#A855F7` |
| Neon Cyan | `#06B6D4` |
| Font | Inter (UI) + JetBrains Mono (code/data) |

---

## ⚠️ Notes on Scraping

IMDb periodically changes its HTML structure. The scraper tries multiple selectors and falls back to demo data if scraping fails. For production use, consider:

- Running behind a proxy service
- Using IMDb's official data partner (Box Office Mojo API)
- Adding rotating user agents

---

## 📄 License

MIT
