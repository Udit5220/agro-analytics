import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema({
  sellerId: { type: String, default: 'guest' },
  sellerName: { type: String, required: true },
  sellerType: { type: String, enum: ['farmer', 'fpo', 'trader', 'dealer', 'processor'], default: 'farmer' },
  listingType: { type: String, enum: ['produce', 'input', 'service'], default: 'produce' },
  commodity: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: String, default: '' },
  variety: { type: String, default: 'Common' },
  grade: { type: String, default: 'FAQ' },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  expectedPrice: { type: Number, required: true },
  priceUnit: { type: String, default: 'per Quintal' },
  harvestDate: { type: Date, default: null },
  availableDate: { type: Date, default: Date.now },
  pickupLocation: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  photos: [{ type: String }],
  description: { type: String, default: '' },
  contactPreference: { type: String, enum: ['call', 'chat', 'whatsapp'], default: 'call' },
  contactNumber: { type: String, default: '' },
  status: { type: String, enum: ['active', 'draft', 'sold', 'expired', 'paused'], default: 'active' },
  isVerifiedSeller: { type: Boolean, default: false },
  mandiBenchmarkPrice: { type: Number, default: 0 },
  priceComparisonPercent: { type: Number, default: 0 }, // positive = above mandi, negative = below
  viewCount: { type: Number, default: 0 },
  offerCount: { type: Number, default: 0 },
}, { timestamps: true, collection: 'agroindia_marketplace_listings' });

marketplaceListingSchema.index({ commodity: 1, district: 1, status: 1 });
marketplaceListingSchema.index({ status: 1, createdAt: -1 });
marketplaceListingSchema.index({ sellerType: 1, listingType: 1 });

export default mongoose.model('AgroindiMarketplaceListing', marketplaceListingSchema);
