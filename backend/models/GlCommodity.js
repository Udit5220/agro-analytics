/**
 * GlCommodity.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose model for the existing Greenleaf "commodities" collection
 * in the greenleaf-dev database.
 *
 * Collection: "commodities"  (DO NOT rename — already exists in MongoDB Atlas)
 *
 * Fields discovered from greenleaf-dev.commodities export:
 *   _id, commodity_name, commodity_type, is_active, parent_name,
 *   commodity_name_other_language (optional), page (optional), createdAt, updatedAt
 */

import mongoose from 'mongoose';

const glCommoditySchema = new mongoose.Schema(
  {
    commodity_name:                 { type: String, required: true, trim: true },
    commodity_type:                 {
      type: String,
      enum: ['agricultural', 'metal and minerals', 'energy', 'oil and seeds', 'agriculture'],
      default: 'agricultural',
    },
    is_active:                      { type: Boolean, default: true },
    parent_name:                    { type: String, default: '' },
    commodity_name_other_language:  { type: String, default: '' },
    page:                           [{ type: mongoose.Schema.Types.ObjectId }],
  },
  {
    // ⚠️  Must match the real collection name — already populated in greenleaf-dev
    collection: 'commodities',
    timestamps: true,
    strict: false,   // allow extra fields without throwing (future-proof)
  }
);

// Indexes for fast name lookups used in meta / compare endpoints
glCommoditySchema.index({ commodity_name: 1 });
glCommoditySchema.index({ commodity_type: 1 });
glCommoditySchema.index({ is_active: 1 });
glCommoditySchema.index({ parent_name: 1 });

export default mongoose.model('GlCommodity', glCommoditySchema);
