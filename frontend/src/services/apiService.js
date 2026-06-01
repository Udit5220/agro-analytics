/**
 * apiService.js — Central API service for AgroIndia frontend.
 * ─────────────────────────────────────────────────────────────
 * Uses /api prefix → proxied by Vite to http://localhost:5000 in dev.
 * In production, VITE_API_BASE_URL is used directly.
 *
 * Data source architecture:
 *  - Commodity endpoints: Greenleaf API first → MongoDB fallback
 *  - Weather/Marketplace: MongoDB (agro-specific collections)
 *  - Greenleaf proxy (/api/gl/*): direct passthrough to Greenleaf backend
 */

const BASE = '/api';

const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    console.error(`API Error [${url}]:`, err.message);
    throw err;
  }
};

const qs = (params) => new URLSearchParams(
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined))
).toString();

// ─── Commodity APIs (Greenleaf primary → MongoDB fallback) ────────────────────
export const commodityApi = {
  getDashboard:     ()            => request('/commodity-dashboard'),
  getCommodities:   (params = {}) => request(`/commodities?${qs(params)}`),
  getMandiPrices:   (params = {}) => request(`/mandi-prices?${qs(params)}`),
  getPriceTrends:   (commodity, mandi, days = 30) =>
                                     request(`/price-trends?commodity=${commodity}&mandi=${mandi}&days=${days}`),
  getNearbyMandis:  (params = {}) => request(`/nearby-mandis?${qs(params)}`),

  // Watchlist (MongoDB)
  getWatchlist:        ()         => request('/watchlist'),
  addToWatchlist:      (data)     => request('/watchlist',     { method: 'POST',   body: JSON.stringify(data) }),
  removeFromWatchlist: (id)       => request(`/watchlist/${id}`, { method: 'DELETE' }),

  // Price Alerts (MongoDB)
  getPriceAlerts:   ()            => request('/price-alerts'),
  createPriceAlert: (data)        => request('/price-alerts',     { method: 'POST',  body: JSON.stringify(data) }),
  updatePriceAlert: (id, data)    => request(`/price-alerts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  createCommodityAlert: (payload) => request("/commodity/alerts", { method: "POST", body: JSON.stringify(payload) }),
  chatWithCommodityAI: (payload)  => request("/commodity/ai-chat", { method: "POST", body: JSON.stringify(payload) }),
};

// ─── Analytics APIs (Greenleaf DB collections — real data) ───────────────────
// Uses greenleaf-dev.commodityvalues, commodityfutures, commodities collections
export const analyticsApi = {
  // Full commodity list with capability flags (hasTrend, hasFutures, hasMandiSpread)
  getMeta:      (params = {}) => request(`/commodity-meta?${qs(params)}`),

  // Parallel price trend comparison for 2–5 crops (normalized to index 100)
  compare:      (commodities, days = 30) =>
                  request(`/commodity-compare?commodities=${encodeURIComponent(commodities)}&days=${days}`),

  // Latest futures contracts for a commodity (OHLCV per expiry month)
  getFutures:   (commodity, portal = 'all') =>
                  request(`/commodity-futures?commodity=${encodeURIComponent(commodity)}&portal=${portal}`),

  // Month-wise price seasonality (derived from real historical records)
  getSeasonality: (commodity) =>
                  request(`/commodity-seasonality?commodity=${encodeURIComponent(commodity)}`),

  // Mandi-wise price spread (agroindia seeded data — multi-mandi comparison)
  getMandiSpread: (commodity) =>
                  request(`/mandi-spread?commodity=${encodeURIComponent(commodity)}`),

  // ── New Commodity Terminal Endpoints ──
  getSpreadAnalysis: (commodity) =>
                  request(`/spread-analysis?commodity=${encodeURIComponent(commodity)}`),
  getSpreadAnalysisFull: (commodity) =>
                  request(`/commodity/spread-analysis-full?commodity=${encodeURIComponent(commodity)}`),
  getGlobalTradeImpact: (commodity) =>
                  request(`/commodity/global-trade-impact?commodity=${encodeURIComponent(commodity)}`),
  getMarketSignals: (commodity) =>
                  request(`/commodity/market-signals?commodity=${encodeURIComponent(commodity)}`),
  getAiCommentary: (commodity) =>
                  request(`/commodity/ai-commentary?commodity=${encodeURIComponent(commodity)}`),
};

// ─── Greenleaf Proxy APIs (/api/gl/*) ─────────────────────────────────────────
// Use these for charts that need raw Greenleaf data (grains, oil seeds, sugar).
export const greenleafApi = {
  health:           ()                              => request('/gl/health'),
  getCommodities:   (params = {})                   => request(`/gl/commodities?${qs(params)}`),

  // Grains (wheat, corn, rice, maize)
  getGrainCities:   (type)                          => request(`/gl/grains/${type}/cities`),
  getGrainContinuous: (type, body)                  => request(`/gl/grains/${type}/continuous`, { method: 'POST', body: JSON.stringify(body) }),
  getGrainSeasonal:   (type, body)                  => request(`/gl/grains/${type}/seasonal`,   { method: 'POST', body: JSON.stringify(body) }),

  // Oil & Seeds (soybean, mustard, cotton, etc.)
  getOilSeedsMasters:     ()                        => request('/gl/oil-seeds/masters'),
  getOilSeedsContinuous:  (body)                    => request('/gl/oil-seeds/continuous', { method: 'POST', body: JSON.stringify(body) }),
  getOilSeedsSeasonal:    (body)                    => request('/gl/oil-seeds/seasonal',   { method: 'POST', body: JSON.stringify(body) }),

  // Sugar
  getSugarContinuous: (body)                        => request('/gl/sugar/continuous', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Weather & Reservoir APIs (MongoDB) ───────────────────────────────────────
export const weatherApi = {
  getCurrentWeather:    (district, lat, lng) => request(`/weather/current?district=${district}${lat ? `&lat=${lat}` : ''}${lng ? `&lng=${lng}` : ''}`),
  getForecast:          (district, days = 7)  => request(`/weather/forecast?district=${district}&days=${days}`),
  getRainfall:          (district, days = 14) => request(`/weather/rainfall?district=${district}&days=${days}`),
  getAlerts:            (params = {})    => request(`/weather/alerts?${qs(params)}`),
  getReservoirs:        (params = {})    => request(`/weather/reservoirs?${qs(params)}`),
  getReservoirById:     (id)             => request(`/weather/reservoirs/${id}`),
  getIrrigationAdvisory:(district)       => request(`/weather/irrigation-advisory?district=${district}`),
};

// ─── Marketplace APIs (MongoDB) ───────────────────────────────────────────────
export const marketplaceApi = {
  getDashboard: ()                  => request('/marketplace/dashboard'),

  // Listings
  getListings:   (params = {})      => request(`/marketplace/listings?${qs(params)}`),
  createListing: (data)             => request('/marketplace/listings', { method: 'POST',   body: JSON.stringify(data) }),
  getListingById:(id)               => request(`/marketplace/listings/${id}`),
  updateListing: (id, data)         => request(`/marketplace/listings/${id}`, { method: 'PATCH',  body: JSON.stringify(data) }),
  deleteListing: (id)               => request(`/marketplace/listings/${id}`, { method: 'DELETE' }),

  // Buyer Requirements
  getBuyerRequirements:   (params = {}) => request(`/marketplace/buyer-requirements?${qs(params)}`),
  createBuyerRequirement: (data)        => request('/marketplace/buyer-requirements', { method: 'POST', body: JSON.stringify(data) }),

  // Offers
  getOffers:   (params = {})  => request(`/marketplace/offers?${qs(params)}`),
  createOffer: (data)         => request('/marketplace/offers',     { method: 'POST',  body: JSON.stringify(data) }),
  updateOffer: (id, data)     => request(`/marketplace/offers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  acceptOffer: (id)           => request(`/marketplace/offers/${id}/accept`, { method: 'PATCH' }),

  // Orders
  getOrders:   (params = {})  => request(`/marketplace/orders?${qs(params)}`),
  createOrder: (data)         => request('/marketplace/orders',     { method: 'POST',  body: JSON.stringify(data) }),
  updateOrder: (id, data)     => request(`/marketplace/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Invoices
  getInvoices:   ()     => request('/marketplace/invoices'),
  createInvoice: (data) => request('/marketplace/invoices', { method: 'POST', body: JSON.stringify(data) }),
};

// export default { commodityApi, analyticsApi, greenleafApi, weatherApi, marketplaceApi };
// ─── Farmer Profile & Land Assets APIs (MongoDB) ──────────────────────────────
export const profileApi = {
  getProfile:     ()          => request('/profile'),
  updateProfile:  (data)      => request('/profile',           { method: 'PUT',    body: JSON.stringify(data) }),
  addFarm:        (data)      => request('/profile/farms',     { method: 'POST',   body: JSON.stringify(data) }),
  updateFarm:     (id, data)  => request(`/profile/farms/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteFarm:     (id)        => request(`/profile/farms/${id}`, { method: 'DELETE' }),
  getCropRankings: (data)     => request('/crop-ranking',      { method: 'POST',   body: JSON.stringify(data) }),
};

export default { commodityApi, greenleafApi, weatherApi, marketplaceApi, profileApi, analyticsApi };
