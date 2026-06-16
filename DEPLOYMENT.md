# AgroIndia Platform — Deployment Guide

> **Version**: 1.0.0 | **Last Updated**: June 2026
> Full-stack deployment guide for the AgroIndia Analytics Platform (React + Express + MongoDB)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Deployment Options](#deployment-options)
  - [Option A: Vercel (Frontend) + Render (Backend)](#option-a-vercel-frontend--render-backend)
  - [Option B: Railway (Full Stack)](#option-b-railway-full-stack)
  - [Option C: AWS / VPS](#option-c-aws--vps)
  - [Option D: Docker](#option-d-docker)
- [Database Setup](#database-setup)
- [Seed Data](#seed-data)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    AgroIndia Platform                     │
├──────────────────┬───────────────────────────────────────┤
│    Frontend      │              Backend                  │
│  (Vite + React)  │        (Express + Node.js)            │
│                  │                                       │
│  • React 19      │  • Express 4.x                        │
│  • Tailwind CSS  │  • Mongoose 8.x (MongoDB)             │
│  • React Router  │  • Gemini AI Integration              │
│  • Recharts      │  • Greenleaf API Proxy                │
│  • Leaflet Maps  │  • Dual-DB Context Switching          │
│                  │                                       │
│  Port: 5173      │  Port: 5000                           │
│  (dev server)    │  (API server)                         │
└──────────────────┴───────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   MongoDB Atlas       │
              │                       │
              │  Primary: greenleaf-  │
              │           dev         │
              │  Secondary: agro-     │
              │             india     │
              └───────────────────────┘
```

---

## Prerequisites

| Tool      | Version  | Purpose                        |
|-----------|----------|--------------------------------|
| Node.js   | ≥ 18.x   | Runtime for frontend & backend |
| npm       | ≥ 9.x    | Package management             |
| MongoDB   | Atlas    | Cloud database (or local)      |
| Git       | ≥ 2.x    | Version control                |

---

## Environment Variables

### Backend (`/backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB — Primary (read-only seed data)
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/greenleaf-dev

# MongoDB — Secondary (write operations, campaigns, profiles)
MONGO_URI_1=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/agro-india

# External APIs
GREENLEAF_API_BASE=https://greenleaf-development-apis.aventiq.ai
GEMINI_API_KEY=<your-gemini-api-key>
```

### Frontend (`/frontend/.env`)

```env
# Gemini API Key (client-side, for direct AI calls)
VITE_GEMINI_API_KEY=<your-gemini-api-key>

# Backend API URL (only needed if NOT using Vite proxy, e.g., production)
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

> **⚠️ Security Note**: Never commit `.env` files. Both are included in `.gitignore`.

---

## Local Development

### 1. Clone & Install

```bash
git clone https://github.com/your-org/agro-analytics.git
cd agro-analytics

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and API keys

# Frontend
# Create frontend/.env with VITE_GEMINI_API_KEY
```

### 3. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev          # Starts nodemon on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev          # Starts Vite dev server on port 5173
```

The Vite dev server automatically proxies `/api/*` requests to `http://localhost:5000`.

### 4. Seed the Database (Optional)

```bash
cd backend

# Seed individual collections
npm run seed:commodities
npm run seed:mandi
npm run seed:weather
npm run seed:marketplace

# Or seed everything at once
npm run seed:all
```

---

## Production Build

### Frontend Build

```bash
cd frontend
npm run build        # Generates /frontend/dist/
npm run preview      # Preview production build locally
```

The build output is in `frontend/dist/` — static files ready for any CDN or static host.

### Backend

The backend runs directly with Node.js in production:

```bash
cd backend
NODE_ENV=production node server.js
```

---

## Deployment Options

### Option A: Vercel (Frontend) + Render (Backend)

**Best for**: Quick setup, free tier available, automatic HTTPS

#### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set the following in Vercel project settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Add environment variables:
   - `VITE_GEMINI_API_KEY` = your Gemini key
   - `VITE_API_BASE_URL` = your Render backend URL
4. Deploy!

#### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
4. Add all backend `.env` variables in the Render dashboard
5. Deploy!

> **Important**: Update `cors` origin in `server.js` to your Vercel domain:
> ```js
> app.use(cors({ origin: 'https://your-app.vercel.app' }));
> ```

---

### Option B: Railway (Full Stack)

**Best for**: Monorepo deployment, simple setup

1. Connect repo to [Railway](https://railway.app)
2. Create two services from the same repo:
   - **Frontend Service**: Root = `frontend`, Start = `npm run preview -- --port $PORT`
   - **Backend Service**: Root = `backend`, Start = `node server.js`
3. Add a MongoDB plugin or use your Atlas URI
4. Set environment variables for each service
5. Railway auto-assigns domains and handles HTTPS

---

### Option C: AWS / VPS

**Best for**: Full control, enterprise deployments

#### Using PM2 + Nginx

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start server.js --name "agroindia-backend" --env production

# Build frontend
cd ../frontend
npm run build
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /var/www/agro-analytics/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable and restart Nginx
sudo ln -s /etc/nginx/sites-available/agroindia /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

---

### Option D: Docker

#### `Dockerfile` — Backend

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ .
EXPOSE 5000
CMD ["node", "server.js"]
```

#### `Dockerfile` — Frontend

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### `docker-compose.yml`

```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    env_file:
      - backend/.env
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

```bash
docker-compose up -d --build
```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist your server IP (or use `0.0.0.0/0` for development)
4. Get the connection string and add to `.env`

### Dual Database Architecture

The platform uses a **dual-database context switching** pattern:

| Database         | Purpose                                    | Env Variable  |
|------------------|--------------------------------------------|---------------|
| `greenleaf-dev`  | Primary — seed/reference data (reads)      | `MONGO_URI`   |
| `agro-india`     | Secondary — user data, campaigns (writes)  | `MONGO_URI_1` |

The middleware in `server.js` automatically routes:
- `GET` requests → Primary database
- `POST/PUT/DELETE/PATCH` requests → Secondary database
- `/campaigns` endpoints → Always secondary

---

## Seed Data

### Backend Seed Scripts (`/backend/scripts/`)

| Script                  | Command                    | Purpose                        |
|-------------------------|----------------------------|--------------------------------|
| `seedCommodities.js`    | `npm run seed:commodities` | Commodity master data          |
| `seedWeather.js`        | `npm run seed:weather`     | Weather forecasts & alerts     |
| `seedMarketplace.js`    | `npm run seed:marketplace` | Marketplace listings & orders  |
| **All at once**         | `npm run seed:all`         | Runs all seed scripts          |

### Backend Seed JSON (`/backend/seed-json/`)

Static JSON files used by seed scripts:
- `mandi_prices.json` — APMC market price data
- `weather_forecasts.json` — Historical weather data
- `marketplace_listings.json` — Sample marketplace listings
- `commodities.json` — Commodity reference data
- And 11 more data files

### Frontend Seed JSON (`/frontend/src/seed-json/`)

- `seededData.json` (321 KB) — Comprehensive crop, disease, weather, and market reference data used by 40+ frontend components for offline/local intelligence

---

## Post-Deployment Checklist

- [ ] **Environment variables** are set correctly for both frontend and backend
- [ ] **CORS origin** in `server.js` is updated to your production frontend domain
- [ ] **MongoDB** connection is verified (`GET /api/health` returns `status: ok`)
- [ ] **Gemini API key** is valid and has sufficient quota
- [ ] **Greenleaf API** base URL is accessible from your backend server
- [ ] **Database seeding** has been run (if fresh deployment)
- [ ] **HTTPS** is enabled (via provider or Let's Encrypt)
- [ ] **`.env` files** are NOT committed to git
- [ ] **Frontend build** loads correctly (check `/api` proxy works)
- [ ] **Error monitoring** is configured (optional: Sentry, LogRocket)

---

## Troubleshooting

### Build Errors

| Error                                      | Solution                                            |
|--------------------------------------------|-----------------------------------------------------|
| `Module not found: seededData.json`        | Verify `seed-json/seededData.json` exists in `src/` |
| `VITE_GEMINI_API_KEY is undefined`         | Check `frontend/.env` has the key set               |
| `react-leaflet` optimization error         | `vite.config.js` includes it in `optimizeDeps`      |

### Runtime Errors

| Error                                      | Solution                                            |
|--------------------------------------------|-----------------------------------------------------|
| `MongoDB connection failed`               | Check `MONGO_URI` and IP whitelist in Atlas          |
| `CORS blocked`                            | Update `cors({ origin })` in `server.js`            |
| `/api/*` returns 404 in production        | Ensure Nginx/proxy is configured for `/api/` route  |
| `Gemini rate limit exceeded`              | Rotate keys or implement request throttling          |

### Health Check

```bash
# Test backend is running
curl https://your-backend.com/api/health

# Expected response:
{
  "status": "ok",
  "service": "AgroIndia Backend",
  "version": "1.0.0",
  "modules": ["commodity-market-intelligence", "weather-reservoir", "marketplace"]
}
```

---

## Quick Reference Commands

```bash
# Development
cd backend  && npm run dev       # Backend dev server (port 5000)
cd frontend && npm run dev       # Frontend dev server (port 5173)

# Production
cd frontend && npm run build     # Build static assets
cd backend  && node server.js    # Start production server

# Database
cd backend && npm run seed:all   # Seed all collections

# Lint
cd frontend && npm run lint      # ESLint check
```

---

*Built with ❤️ by AventIQ — AgroIndia Analytics Platform*
