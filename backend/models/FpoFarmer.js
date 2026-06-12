import mongoose from 'mongoose';

const fpoFarmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true }, // e.g. F-101
  name: { type: String, required: true },
  village: { type: String, required: true },
  district: { type: String, default: 'Sonipat' },
  state: { type: String, default: 'Haryana' },
  land: { type: String, required: true }, // e.g. "1.2 Ha" or "0.8 Ha"
  landSizeNum: { type: Number, required: true }, // In hectares for calculations
  category: { type: String, enum: ['SC', 'ST', 'OBC', 'General'], default: 'General' },
  phone: { type: String, default: '' },
  aadhaarSeeded: { type: Boolean, default: true },
  mobileVerified: { type: Boolean, default: true },
  pendingBenefits: { type: String, default: '₹0' },
  schemes: {
    pmKisan: { type: String, enum: ['enrolled', 'eligible-not-enrolled', 'not-eligible'], default: 'eligible-not-enrolled' },
    pmfby: { type: String, enum: ['enrolled', 'eligible-not-enrolled', 'not-eligible'], default: 'eligible-not-enrolled' },
    kcc: { type: String, enum: ['enrolled', 'eligible-not-enrolled', 'not-eligible'], default: 'eligible-not-enrolled' },
    pmKmy: { type: String, enum: ['enrolled', 'eligible-not-enrolled', 'not-eligible'], default: 'eligible-not-enrolled' },
    eNam: { type: String, enum: ['enrolled', 'eligible-not-enrolled', 'not-eligible'], default: 'eligible-not-enrolled' }
  }
}, { timestamps: true, collection: 'agroindia_fpo_farmers' });

export default mongoose.model('FpoFarmer', fpoFarmerSchema);
