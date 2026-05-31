import mongoose from 'mongoose';

// Extended from Greenleaf's reservoir.model.js pattern
const reservoirSchema = new mongoose.Schema({
  damName: { type: String, required: true },
  reservoirName: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  river: { type: String, default: '' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  fullReservoirLevel: { type: Number, default: 0 }, // in meters
  currentWaterLevel: { type: Number, default: 0 },
  liveStorage: { type: Number, default: 0 }, // in BCM
  storageCapacity: { type: Number, default: 0 }, // in BCM (dam_capacity_in_bcm from Greenleaf)
  storagePercentage: { type: Number, default: 0 }, // 0-100
  previousYearStorage: { type: Number, default: 0 },
  tenYearAvgStorage: { type: Number, default: 0 },
  status: { type: String, enum: ['normal', 'low', 'critical', 'overflow'], default: 'normal' },
  lastUpdated: { type: Date, default: Date.now },
  source: { type: String, default: 'CWC' }, // Central Water Commission
  isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: 'agroindia_reservoirs' });

reservoirSchema.index({ location: '2dsphere' });
reservoirSchema.index({ district: 1, status: 1 });

export default mongoose.model('AgroindiReservoir', reservoirSchema);
