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
    pmKisan: { type: String, enum: ['recommended', 'interested', 'apply-link-shared', 'profile-complete', 'self-reported-applied', 'self-reported-benefit-received', 'not-eligible'], default: 'recommended' },
    pmfby: { type: String, enum: ['recommended', 'interested', 'apply-link-shared', 'profile-complete', 'self-reported-applied', 'self-reported-benefit-received', 'not-eligible'], default: 'recommended' },
    kcc: { type: String, enum: ['recommended', 'interested', 'apply-link-shared', 'profile-complete', 'self-reported-applied', 'self-reported-benefit-received', 'not-eligible'], default: 'recommended' },
    pmKmy: { type: String, enum: ['recommended', 'interested', 'apply-link-shared', 'profile-complete', 'self-reported-applied', 'self-reported-benefit-received', 'not-eligible'], default: 'recommended' },
    eNam: { type: String, enum: ['recommended', 'interested', 'apply-link-shared', 'profile-complete', 'self-reported-applied', 'self-reported-benefit-received', 'not-eligible'], default: 'recommended' }
  }
}, { timestamps: true, collection: 'agroindia_fpo_farmers' });

export default mongoose.model('FpoFarmer', fpoFarmerSchema);
