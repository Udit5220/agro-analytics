/**
 * GlCommodityFutures.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose model for the existing Greenleaf "commodityfutures" collection
 * in the greenleaf-dev database.
 *
 * Collection: "commodityfutures"  (DO NOT rename — already exists in MongoDB Atlas)
 *
 * Fields discovered from greenleaf-dev.commodityfutures export:
 *   _id, commodity_id (→ commodities._id), date, portal, source, is_active,
 *   expiry_data: [{
 *     contract, last_price, change_in_price, open_price, high_price,
 *     low_price, previous_price, volume, open_interest
 *   }]
 *
 * Portals:
 *   "ifp"     — International Futures Platform (Barchart.com) — CBOT, ICE contracts
 *   "dce_bmd" — Dalian Commodity Exchange / Bursa Malaysia Derivatives
 *   "oip"     — Oil & Seeds India Platform (MCX/NCDEX-style India futures)
 *
 * Date range in data: 2015-01-01 to 2026-05-28  (~41,807 records)
 *
 * Commodities with futures data (key India agricultural):
 *   Cotton, Wheat, Soybean/Soybeans, Corn/Maize, Chana, Castor/Castor Oil,
 *   Guar/GUARSEED10, Moong, Bajra, Groundnut, Sesame Seed,
 *   Turmeric/TMCFGRNZM, RMSEED (Mustard), Sugar, CPO (Palm Oil), RBD Palmolein
 */

import mongoose from 'mongoose';

// Sub-document schema for each expiry/contract month within a futures record
const expiryDataSchema = new mongoose.Schema(
  {
    contract:        { type: String, default: '' },   // e.g. "ZWN25 (Jul '25)"
    last_price:      { type: String, default: null }, // stored as string in source data
    change_in_price: { type: String, default: null },
    open_price:      { type: String, default: null },
    high_price:      { type: String, default: null },
    low_price:       { type: String, default: null },
    previous_price:  { type: String, default: null },
    volume:          { type: String, default: null },
    open_interest:   { type: String, default: null },
  },
  { _id: false }
);

const glCommodityFuturesSchema = new mongoose.Schema(
  {
    commodity_id:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GlCommodity',
      required: true,
    },
    date:          { type: String, required: true },  // "YYYY-MM-DD"
    portal:        {
      type: String,
      enum: ['ifp', 'dce_bmd', 'oip'],
      default: 'ifp',
    },
    source:        { type: String, default: '' },     // source URL (e.g. barchart.com)
    is_active:     { type: Boolean, default: true },
    expiry_data:   [expiryDataSchema],               // array of contract months

    // Some records also have top-level OHLCV (older format)
    last_price:      { type: String, default: null },
    change_in_price: { type: String, default: null },
    open_price:      { type: String, default: null },
    high_price:      { type: String, default: null },
    low_price:       { type: String, default: null },
    volume:          { type: String, default: null },
    open_interest:   { type: String, default: null },
  },
  {
    // ⚠️  Must match the real collection name — already populated in greenleaf-dev
    collection: 'commodityfutures',
    timestamps: true,
    strict: false,  // allow extra fields (future-proof)
  }
);

// Performance indexes: latest futures per commodity = commodity_id + date desc
glCommodityFuturesSchema.index({ commodity_id: 1, date: -1 });
glCommodityFuturesSchema.index({ commodity_id: 1, portal: 1, date: -1 });
glCommodityFuturesSchema.index({ date: -1 });

export default mongoose.model('GlCommodityFutures', glCommodityFuturesSchema);
