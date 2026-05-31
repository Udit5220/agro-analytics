# AgroIndia Analytics Platform

A modern, responsive agriculture analytics and marketplace platform connecting farmers, FPOs, traders, and processors.

## Current Active Modules

The platform currently focuses on the implementation and testing of the following 3 core modules:

1. **Commodity Market Intelligence**
2. **Weather & Reservoir Intelligence**
3. **Marketplace Module**

> **Note:** Other modules may be visible on the homepage UI (e.g., AI Agriculture Assistant, Government Scheme Center, Disease Detection, Smart Crop Recommendation, News Intelligence, Research AI, Learning Hub), but the current active implementation focus is solely on the 3 modules listed above.

## Tech Stack

### Frontend
* React 19
* Vite
* React Router
* Tailwind CSS
* Recharts
* Lucide React
* Plus Jakarta Sans

### Backend
* Node.js
* Express.js
* Mongoose
* MongoDB Atlas
* Axios
* dotenv

### Database
* MongoDB Atlas
* Database name: `greenleaf-dev`
* New app-specific collections use the `agroindia_` prefix to distinguish them.

---

## Important Architecture & Data Flow

**1. Commodity Market Intelligence**
* Tries **Greenleaf API** first for live prices and dashboards.
* Falls back to **MongoDB** if the API fails or returns no data.
* Returns an empty, safe response if both are unavailable (no crashing).

**2. Weather & Reservoir Intelligence**
* Uses MongoDB `agroindia_` seed collections.
* Returns an empty, safe response if MongoDB is unavailable.

**3. Marketplace Module**
* Uses MongoDB `agroindia_` app-specific collections.
* Returns an empty, safe response if MongoDB is unavailable.

### Greenleaf API Base
`GREENLEAF_API_BASE=https://greenleaf-development-apis.aventiq.ai`

---

## Environment Configuration

### Backend `.env`
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://greenleaf_dev_user:PASSWORD@ac-lrbypee-shard-00-00.niaur5h.mongodb.net:27017,ac-lrbypee-shard-00-01.niaur5h.mongodb.net:27017,ac-lrbypee-shard-00-02.niaur5h.mongodb.net:27017/greenleaf-dev?ssl=true&authSource=admin&retryWrites=true&w=majority
GREENLEAF_API_BASE=https://greenleaf-development-apis.aventiq.ai
GEMINI_API_KEY=
NODE_ENV=development
```
> **MongoDB Note:** Originally `mongodb+srv://` caused a `querySrv ETIMEOUT` error in Node/Mongoose due to network constraints. The working fix is to use a standard non-SRV MongoDB URI with direct shard hosts (`mongodb://...`) as shown above. Replace `PASSWORD` with the actual database password.

### Frontend `.env`
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Project Structure

```txt
agro-analytic/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── commodity.controller.js
│   │   ├── marketplace.controller.js
│   │   └── weather.controller.js
│   ├── models/
│   │   ├── Commodity.js
│   │   ├── MandiPrice.js
│   │   ├── Watchlist.js
│   │   ├── PriceAlert.js
│   │   ├── WeatherForecast.js
│   │   ├── WeatherAlert.js
│   │   ├── Reservoir.js
│   │   ├── IrrigationAdvisory.js
│   │   ├── MarketplaceListing.js
│   │   ├── BuyerRequirement.js
│   │   ├── Offer.js
│   │   ├── Order.js
│   │   └── Invoice.js
│   ├── routes/
│   │   ├── commodity.routes.js
│   │   ├── marketplace.routes.js
│   │   └── weather.routes.js
│   ├── scripts/
│   │   ├── seedCommodities.js
│   │   ├── seedWeather.js
│   │   ├── seedMarketplace.js
│   │   └── testConnection.js
│   ├── services/
│   │   ├── greenleafApiService.js
│   │   └── geminiService.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── components/
│   │   ├── data/
│   │   │   └── dashboardContent.js
│   │   ├── layouts/
│   │   │   └── ModuleLayout.jsx
│   │   ├── pages/
│   │   │   ├── market-intelligence/
│   │   │   ├── weather-reservoir/
│   │   │   └── marketplace/
│   │   ├── services/
│   │   │   └── apiService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md
└── package.json
```

---

## MongoDB Collections & Seeding

### Collection Mapping

**Commodity:**
* `agroindia_commodities`
* `agroindia_mandi_prices`
* `agroindia_watchlists`
* `agroindia_price_alerts`

**Weather & Reservoir:**
* `agroindia_reservoirs`
* `agroindia_weather_forecasts`
* `agroindia_weather_alerts`
* `agroindia_irrigation_advisories`

**Marketplace:**
* `agroindia_marketplace_listings`
* `agroindia_buyer_requirements`
* `agroindia_offers`
* `agroindia_orders`
* `agroindia_invoices`

### JSON Seed File Mapping
The `backend/seed-json/` folder contains pre-formatted JSON data that can be imported manually.

**Weather & Reservoir:**
* `reservoirs.json` → `agroindia_reservoirs`
* `weather_forecasts.json` → `agroindia_weather_forecasts`
* `weather_alerts.json` → `agroindia_weather_alerts`
* `irrigation_advisories.json` → `agroindia_irrigation_advisories`

**Marketplace:**
* `marketplace_listings.json` → `agroindia_marketplace_listings`
* `buyer_requirements.json` → `agroindia_buyer_requirements`
* `offers.json` → `agroindia_offers`
* `orders.json` → `agroindia_orders`
* `invoices.json` → `agroindia_invoices`

**Commodity (Optional fallback):**
* `commodities.json` → `agroindia_commodities`
* `mandi_prices.json` → `agroindia_mandi_prices`
* `watchlists.json` → `agroindia_watchlists`
* `price_alerts.json` → `agroindia_price_alerts`

### How to Import Seed Data
Since Node scripts may face network timeouts connecting to the database externally, use **MongoDB Compass** to seed the data manually:

1. Open MongoDB Compass.
2. Connect using your local connection string.
3. Select the `greenleaf-dev` database.
4. Create or select the target `agroindia_` collection.
5. Click **Add Data**.
6. Select **Import JSON or CSV file**.
7. Choose the matching JSON file from `backend/seed-json/`.
8. Confirm document count and import.

---

## Running the Application

### 1. Run Backend
```powershell
cd backend
npm install
npm run dev
```
**Expected Output:**
* Backend running on port `5000`
* MongoDB connected to `greenleaf-dev`
* Greenleaf API configured
* Gemini placeholder key pending

### 2. Run Frontend
```powershell
cd frontend
npm install
npm run dev
```
Vite will start the development server, usually at `http://localhost:5173` or `http://localhost:5174/5176` (check the terminal output).

---

## API Testing Commands (PowerShell)

You can verify the backend is running correctly by executing these commands in PowerShell:

### Health
```powershell
Invoke-RestMethod "http://localhost:5000/api/health"
Invoke-RestMethod "http://localhost:5000/api/gl/health"
```

### Commodity
```powershell
Invoke-RestMethod "http://localhost:5000/api/commodities"
Invoke-RestMethod "http://localhost:5000/api/commodity-dashboard"
Invoke-RestMethod "http://localhost:5000/api/mandi-prices?limit=8"
Invoke-RestMethod "http://localhost:5000/api/watchlist"
Invoke-RestMethod "http://localhost:5000/api/price-alerts"
```

### Weather & Reservoir
```powershell
Invoke-RestMethod "http://localhost:5000/api/weather/current?district=Indore"
Invoke-RestMethod "http://localhost:5000/api/weather/forecast?district=Indore&days=7"
Invoke-RestMethod "http://localhost:5000/api/weather/reservoirs"
Invoke-RestMethod "http://localhost:5000/api/weather/irrigation-advisory?district=Indore"
```

### Marketplace
```powershell
Invoke-RestMethod "http://localhost:5000/api/marketplace/dashboard"
Invoke-RestMethod "http://localhost:5000/api/marketplace/listings"
Invoke-RestMethod "http://localhost:5000/api/marketplace/buyer-requirements"
Invoke-RestMethod "http://localhost:5000/api/marketplace/offers"
Invoke-RestMethod "http://localhost:5000/api/marketplace/orders"
Invoke-RestMethod "http://localhost:5000/api/marketplace/invoices"
```

### All-in-One API Test Script
```powershell
$endpoints = @(
  "/api/health",
  "/api/gl/health",
  "/api/commodities",
  "/api/commodity-dashboard",
  "/api/mandi-prices?limit=8",
  "/api/watchlist",
  "/api/price-alerts",
  "/api/weather/current?district=Indore",
  "/api/weather/forecast?district=Indore&days=7",
  "/api/weather/reservoirs",
  "/api/weather/irrigation-advisory?district=Indore",
  "/api/marketplace/dashboard",
  "/api/marketplace/listings",
  "/api/marketplace/buyer-requirements",
  "/api/marketplace/offers",
  "/api/marketplace/orders",
  "/api/marketplace/invoices"
)

foreach ($ep in $endpoints) {
  try {
    $r = Invoke-RestMethod "http://localhost:5000$ep" -TimeoutSec 10
    Write-Host "✅ $ep success=$($r.success)"
  } catch {
    Write-Host "❌ $ep failed: $($_.Exception.Message)"
  }
}
```

---

## Verified Status & Known Notes

**Verified Working Endpoints:**
* `/api/health`
* `/api/gl/health`
* `/api/commodities`
* `/api/commodity-dashboard`
* `/api/mandi-prices?limit=8`
* `/api/watchlist`
* `/api/price-alerts`
* `/api/weather/current`
* `/api/weather/forecast`
* `/api/weather/reservoirs`
* `/api/weather/irrigation-advisory`
* `/api/marketplace/dashboard`
* `/api/marketplace/listings`
* `/api/marketplace/buyer-requirements`
* `/api/marketplace/offers`
* `/api/marketplace/orders`
* `/api/marketplace/invoices`

**Known Notes & Current Status:**
1. `mongodb+srv://` caused `querySrv ETIMEOUT`, so the backend uses a direct `mongodb://` URI with shard hosts.
2. A duplicate schema index warning on `orderNumber` may appear in the backend console. This is only a warning and does not stop the backend. It can be cleaned up later in the Order model.
3. Gemini AI integration is not active yet. `GEMINI_API_KEY=` is currently empty.
4. Authentication (Auth/JWT) is not implemented in the current phase. Keep routes open for testing.
5. The frontend homepage displays all module cards, but only the 3 specific modules mentioned above are actively wired up and verified.
