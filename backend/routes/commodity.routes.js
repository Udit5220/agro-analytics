/**
 * commodity.routes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes:
 *   /api/commodities         — Commodity list (Greenleaf first → MongoDB fallback)
 *   /api/mandi-prices        — Live mandi prices (Greenleaf first → MongoDB fallback)
 *   /api/price-trends        — Historical chart data
 *   /api/nearby-mandis       — Nearby mandi cards
 *   /api/commodity-dashboard — Market dashboard summary
 *   /api/watchlist           — Watchlist CRUD (MongoDB only)
 *   /api/price-alerts        — Price alerts CRUD (MongoDB only)
 *
 *   /api/gl/*                — Direct Greenleaf API proxy endpoints
 */

import express from "express";
import * as c from "../controllers/commodity.controller.js";
import * as ca from "../controllers/commodity.analytics.controller.js";

const router = express.Router();

// ─── Main commodity endpoints (hybrid: GL first → MongoDB fallback) ────────────
router.get("/commodities", c.getCommodities);
router.get("/mandi-prices", c.getMandiPrices);
router.get("/price-trends", c.getPriceTrends);
router.get("/nearby-mandis", c.getNearbyMandis);
router.get("/commodity-dashboard", c.getDashboard);

// ─── Watchlist (MongoDB — app-specific data) ──────────────────────────────────
router.get("/watchlist", c.getWatchlist);
router.post("/watchlist", c.addToWatchlist);
router.delete("/watchlist/:id", c.removeFromWatchlist);

// ─── Price Alerts (MongoDB — app-specific data) ───────────────────────────────
router.get("/price-alerts", c.getPriceAlerts);
router.post("/price-alerts", c.createPriceAlert);
router.patch("/price-alerts/:id", c.updatePriceAlert);

// ─── Greenleaf API Direct Proxy (/api/gl/*) ───────────────────────────────────
// Use these from the frontend when you need raw Greenleaf data for charts.
// Vite proxy: /api → http://localhost:5000, so frontend calls /api/gl/...
router.get("/gl/health", c.proxyHealth);
router.get("/gl/commodities", c.proxyGetCommodities);
router.get("/gl/grains/:type/cities", c.proxyGrainCities);
router.post("/gl/grains/:type/continuous", c.proxyGrainContinuous);
router.post("/gl/grains/:type/seasonal", c.proxyGrainSeasonal);
router.get("/gl/oil-seeds/masters", c.proxyOilSeedsMasters);
router.post("/gl/oil-seeds/continuous", c.proxyOilSeedsContinuous);
router.post("/gl/oil-seeds/seasonal", c.proxyOilSeedsSeasonal);
router.post("/gl/sugar/continuous", c.proxySugarContinuous);

// ─── Commodity Analytics (real Greenleaf DB collections) ─────────────────────
// These use greenleaf-dev.commodityvalues + commodityfutures as primary sources
router.get("/commodity-meta", ca.getCommodityMeta);
router.get("/commodity-compare", ca.getCommodityCompare);
router.get("/commodity-futures", ca.getCommodityFutures);
router.get("/commodity-seasonality", ca.getCommoditySeasonality);
router.get("/mandi-spread", ca.getMandiSpread);
router.get("/spread-analysis", ca.getSpreadAnalysis);
router.get("/commodity/spread-analysis-full", ca.getSpreadAnalysisFull);

import * as cai from "../controllers/commodity.ai.controller.js";

// ─── New Commodity Terminal Analytics ─────────────────────────────────────────
router.get("/commodity/global-trade-impact", ca.getGlobalTradeImpact);
router.get("/commodity/market-signals", ca.getMarketSignals);
router.get("/commodity/ai-commentary", ca.getAiCommentary);
router.post("/commodity/alerts", ca.createCommodityAlert);
router.post("/commodity/ai-chat", cai.chatWithCommodityAI);

export default router;
