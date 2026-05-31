import mongoose from 'mongoose';

const buyerRequirementSchema = new mongoose.Schema({
  buyerId: { type: String, default: 'guest' },
  buyerName: { type: String, required: true },
  buyerType: { type: String, enum: ['trader', 'processor', 'retailer', 'fpo', 'exporter', 'other'], default: 'trader' },
  commodity: { type: String, required: true },
  variety: { type: String, default: 'Any' },
  grade: { type: String, default: 'FAQ' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  targetPrice: { type: Number, required: true },
  deliveryLocation: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  requiredByDate: { type: Date, default: null },
  notes: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  status: { type: String, enum: ['active', 'fulfilled', 'expired', 'cancelled'], default: 'active' },
}, { timestamps: true, collection: 'agroindia_buyer_requirements' });

buyerRequirementSchema.index({ commodity: 1, status: 1 });
buyerRequirementSchema.index({ district: 1, status: 1 });

export default mongoose.model('AgrindiaBuyerRequirement', buyerRequirementSchema);
