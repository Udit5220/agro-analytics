import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  schemeId: { type: String, required: true },
  farmerId: { type: String, default: 'guest' },
  type: { 
    type: String, 
    enum: ['view', 'guide_open', 'bookmark', 'apply_click'], 
    required: true 
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'agroindia_gov_scheme_interactions' });

// Create indexes for fast aggregation by scheme ID and type
interactionSchema.index({ schemeId: 1, type: 1 });
interactionSchema.index({ farmerId: 1 });

export default mongoose.model('GovSchemeInteraction', interactionSchema);
