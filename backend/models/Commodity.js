import mongoose from 'mongoose';

const commoditySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hindiName: { type: String, default: '' },
  category: { type: String, enum: ['grain', 'oilseed', 'vegetable', 'spice', 'fiber', 'pulse', 'other'], default: 'other' },
  varieties: [{ type: String }],
  grades: [{ type: String }],
  season: { type: String, enum: ['kharif', 'rabi', 'zaid', 'perennial'], default: 'kharif' },
  unit: { type: String, default: 'Quintal' },
  icon: { type: String, default: 'Sprout' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: 'agroindia_commodities' });

commoditySchema.index({ name: 1 });
commoditySchema.index({ category: 1 });

export default mongoose.model('AgrindiaCommodity', commoditySchema);
