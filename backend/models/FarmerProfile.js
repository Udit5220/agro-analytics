import mongoose from 'mongoose';

const farmCropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sowingDate: { type: String, default: '' }, // YYYY-MM-DD string
  sownArea: { type: Number, default: 0 } // Area sown in acres
});

// Sub-schema for individual farms/plots registered under the profile
const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: 'Haryana Region' },
  totalLand: { type: Number, required: true }, // acreage as number
  crops: [farmCropSchema] // crops planted, e.g. [{ name: "Rice", sowingDate: "2026-05-01", sownArea: 2.5 }]
}, { timestamps: true });

const farmerProfileSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest', unique: true }, // guest identifier
  name: { type: String, default: 'Suresh Kumar' },
  state: { type: String, default: 'Haryana' },
  district: { type: String, default: 'Sonipat' },
  landSize: { type: Number, default: 4.5 },
  crops: [{ type: String, default: ['Rice', 'Wheat'] }],
  casteCategory: { type: String, default: 'SC' },
  annualIncome: { type: Number, default: 280000 },
  aadhaarSeedingStatus: { type: String, default: 'seeded' }, // 'seeded' or 'unseeded'
  bankSeedingStatus: { type: String, default: 'seeded' }, // 'seeded' or 'unseeded'
  irrigationMethod: { type: String, default: 'Drip' },

  // For compatibility with legacy pages
  location: { type: String, default: 'Sonipat, Haryana' },
  pincode: { type: String, default: '131001' },
  primaryCrops: [{ type: String, default: ['Rice', 'Wheat'] }],
  farms: [farmSchema]
}, { timestamps: true, collection: 'agroindia_farmer_profiles' });

export default mongoose.model('FarmerProfile', farmerProfileSchema);
