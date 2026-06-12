import mongoose from 'mongoose';

const operationalHoldingsSchema = new mongoose.Schema({
  marginal: { type: Number, default: 0 },   // < 1 Hectare
  small: { type: Number, default: 0 },      // 1 - 2 Hectares
  semiMedium: { type: Number, default: 0 }, // 2 - 4 Hectares
  medium: { type: Number, default: 0 },     // 4 - 10 Hectares
  large: { type: Number, default: 0 }       // > 10 Hectares
});

const districtAgriStatsSchema = new mongoose.Schema({
  districtName: { type: String, required: true, unique: true },
  stateName: { type: String, required: true },
  
  // Operational holdings / Total Farmers (from ICRISAT DLD)
  totalFarmers: { type: Number, default: 0 },
  operationalHoldings: operationalHoldingsSchema,

  // Enrolled Farmers (from data.gov.in / PM-Kisan)
  enrolledFarmers: { type: Number, default: 0 },
  
  // Village-wise census snapshot (used for coverage comparison)
  villages: [
    {
      name: { type: String, required: true },
      totalFarmers: { type: Number, default: 0 },
      enrolledFarmers: { type: Number, default: 0 },
      averageSchemesPerFarmer: { type: Number, default: 0.0 },
      intensity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
    }
  ],
  
  // Stats on reasons for non-enrollment (Statistical/Survey research based)
  nonEnrollmentReasons: [
    { reason: String, percentage: Number, count: Number }
  ],
  
  lastSynced: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'agroindia_district_agri_stats' });

export default mongoose.model('DistrictAgriStats', districtAgriStatsSchema);
