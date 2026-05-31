import mongoose from 'mongoose';

const priceAlertSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' },
  commodity: { type: String, required: true },
  mandiName: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  alertType: { type: String, enum: ['above', 'below'], required: true },
  notificationMethod: { type: String, enum: ['app', 'sms', 'email'], default: 'app' },
  status: { type: String, enum: ['active', 'paused', 'triggered'], default: 'active' },
  triggeredAt: { type: Date, default: null },
  currentPrice: { type: Number, default: 0 },
}, { timestamps: true, collection: 'agroindia_price_alerts' });

priceAlertSchema.index({ userId: 1, status: 1 });
priceAlertSchema.index({ commodity: 1, status: 1 });

export default mongoose.model('AgrindiaPriceAlert', priceAlertSchema);
