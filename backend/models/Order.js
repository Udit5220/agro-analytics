import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgroindiMarketplaceListing' },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgroindiOffer' },
  buyerId: { type: String, default: 'guest' },
  buyerName: { type: String, required: true },
  sellerId: { type: String, default: 'guest' },
  sellerName: { type: String, required: true },
  commodity: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  finalPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  pickupLocation: { type: String, default: '' },
  deliveryLocation: { type: String, required: true },
  deliveryDistrict: { type: String, default: '' },
  deliveryState: { type: String, default: '' },
  orderStatus: {
    type: String,
    enum: ['created', 'confirmed', 'packed', 'dispatched', 'in_transit', 'delivered', 'cancelled', 'disputed'],
    default: 'created',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'escrow_held', 'released'],
    default: 'pending',
  },
  weatherRiskNote: { type: String, default: '' }, // Cross-module: weather impact on delivery
  logisticsNote: { type: String, default: '' },
  expectedDeliveryDate: { type: Date, default: null },
}, { timestamps: true, collection: 'agroindia_orders' });

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `AGR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

orderSchema.index({ buyerId: 1, orderStatus: 1 });
orderSchema.index({ sellerId: 1, orderStatus: 1 });
orderSchema.index({ orderNumber: 1 });

export default mongoose.model('AgroindiOrder', orderSchema);
