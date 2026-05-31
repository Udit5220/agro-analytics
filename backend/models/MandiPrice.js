import mongoose from 'mongoose';

const mandiPriceSchema = new mongoose.Schema({
  commodity: { type: String, required: true },
  variety: { type: String, default: 'Common' },
  grade: { type: String, default: 'FAQ' },
  mandiName: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  arrivalVolume: { type: Number, default: 0 },
  unit: { type: String, default: 'Quintal' },
  priceDate: { type: Date, default: Date.now },
  source: { type: String, default: 'agroindia' },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  changePercent: { type: Number, default: 0 },
  previousModalPrice: { type: Number, default: 0 },
}, { timestamps: true, collection: 'agroindia_mandi_prices' });

mandiPriceSchema.index({ commodity: 1, mandiName: 1, priceDate: -1 });
mandiPriceSchema.index({ state: 1, district: 1 });
mandiPriceSchema.index({ priceDate: -1 });

export default mongoose.model('AgroindiaMandirPrice', mandiPriceSchema);
