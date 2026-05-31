import mongoose from 'mongoose';

const irrigationAdvisorySchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  crop: { type: String, default: 'General' },
  irrigationAdvice: {
    type: String,
    enum: ['irrigate_today', 'wait', 'avoid', 'reduce', 'monitor'],
    default: 'monitor',
  },
  reason: { type: String, default: '' },
  rainExpected: { type: Boolean, default: false },
  rainProbability: { type: Number, default: 0 },
  reservoirStatus: { type: String, default: 'normal' },
  canalReleaseStatus: { type: String, default: 'normal' },
  soilMoistureLevel: { type: String, enum: ['dry', 'adequate', 'wet', 'waterlogged'], default: 'adequate' },
  recommendation: { type: String, default: '' },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  validForDate: { type: Date, default: Date.now },
}, { timestamps: true, collection: 'agroindia_irrigation_advisories' });

irrigationAdvisorySchema.index({ district: 1, validForDate: -1 });

export default mongoose.model('AgroindiIrrigationAdvisory', irrigationAdvisorySchema);
