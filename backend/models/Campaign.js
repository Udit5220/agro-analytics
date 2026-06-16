import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  disease: { type: String, required: true },
  villages: [{ type: String, required: true }],
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Pending', 'Completed', 'Paused'], default: 'Pending' },
  officers: { type: Number, default: 1 },
  targetFarmers: { type: Number, default: 100 },
  completedFarmers: { type: Number, default: 0 },
  type: { type: String, enum: ['Chemical Spray', 'Prophylactic Dusting', 'Systemic Fungicide'], default: 'Chemical Spray' },
  startDate: { type: String, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true, collection: 'agroindia_treatment_campaigns' });

campaignSchema.index({ status: 1 });
campaignSchema.index({ disease: 1 });

export default mongoose.model('Campaign', campaignSchema);
