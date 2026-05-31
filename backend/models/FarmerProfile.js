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

// Schema for the primary farmer profile
const farmerProfileSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest', unique: true }, // guest identifier
  name: { type: String, default: 'Suresh Kumar' },
  location: { type: String, default: 'Faridabad, Haryana' },
  pincode: { type: String, default: '121001' },
  primaryCrops: [{ type: String, default: ['Rice', 'Wheat'] }],
  farms: [farmSchema]
}, { timestamps: true, collection: 'agroindia_farmer_profiles' });

export default mongoose.model('FarmerProfile', farmerProfileSchema);
