import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgroindiMarketplaceListing', required: true },
  buyerId: { type: String, default: 'guest' },
  buyerName: { type: String, required: true },
  sellerId: { type: String, default: 'guest' },
  sellerName: { type: String, required: true },
  commodity: { type: String, required: true },
  offerPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'countered', 'expired'], default: 'pending' },
  counterPrice: { type: Number, default: 0 },
  counterMessage: { type: String, default: '' },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }, // 3 days
}, { timestamps: true, collection: 'agroindia_offers' });

offerSchema.index({ listingId: 1, status: 1 });
offerSchema.index({ buyerId: 1 });
offerSchema.index({ sellerId: 1 });

export default mongoose.model('AgroindiOffer', offerSchema);
