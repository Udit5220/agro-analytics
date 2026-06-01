/**
 * GlCommodityValue.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose model for the existing Greenleaf "commodityvalues" collection
 * in the greenleaf-dev database.
 *
 * Collection: "commodityvalues"  (DO NOT rename — already exists in MongoDB Atlas)
 *
 * Fields discovered from greenleaf-dev.commodityvalues export:
 *   _id, commodity_id (→ commodities._id), date, price, min_price, max_price,
 *   spot_price, city_id (ref — cities collection not exported), unit, source,
 *   price_time, is_active, createdAt, updatedAt
 *
 * Date range in data: 2024-07-17 to 2026-05-30  (~227,054 records total)
 *
 * Key record counts (verified):
 *   Wheat         → 4,406  (id: 68239af9625b5039b06b5fd6)
 *   Bajra         → 3,603  (id: 681da4b7bbc1b5a6a08e626c)
 *   Cotton        → 3,039  (id: 681da4b7bbc1b5a6a08e6271)
 *   GUARSEED10    → 2,213  (id: 6822fa9346255be54cb3edd8)
 *   CHANAAKL      → 2,210  (id: 6822fa9346255be54cb3edce)
 *   Chana         → 2,207  (id: 681da4b7bbc1b5a6a08e6270)
 *   COTTONKADI    → 2,199  (id: 6822fa9346255be54cb3edd2)
 *   Castor        → 2,155  (id: 681da4b7bbc1b5a6a08e626e)
 *   SYBEANAKL     → 1,837  (id: 6822fa9346255be54cb3edf2)
 *   MAIZE         → 1,828  (id: 6822fa9346255be54cb3ede0)
 *   Moong         → 1,802  (id: 681da4b7bbc1b5a6a08e6282)
 *   TMCFGRNZM     → 1,617  (id: 68239af9625b5039b06b5fd4)
 */

import mongoose from 'mongoose';

const glCommodityValueSchema = new mongoose.Schema(
  {
    commodity_id:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GlCommodity',
      required: true,
    },
    date:          { type: String, required: true },   // stored as "YYYY-MM-DD" string
    price:         { type: Number, default: null },     // single spot price
    min_price:     { type: Number, default: null },
    max_price:     { type: Number, default: null },
    spot_price:    { type: Number, default: null },
    city_id:       { type: mongoose.Schema.Types.ObjectId, default: null },
    unit:          { type: String, default: '' },
    price_time:    { type: String, default: '' },
    source:        { type: String, default: '' },
    is_active:     { type: Boolean, default: true },
  },
  {
    // ⚠️  Must match the real collection name — already populated in greenleaf-dev
    collection: 'commodityvalues',
    timestamps: true,
    strict: false,  // allow extra fields (future-proof)
  }
);

// Critical performance indexes for trend queries (commodity_id + date range)
glCommodityValueSchema.index({ commodity_id: 1, date: -1 });
glCommodityValueSchema.index({ commodity_id: 1, date: 1  });
glCommodityValueSchema.index({ date: -1 });

export default mongoose.model('GlCommodityValue', glCommodityValueSchema);
