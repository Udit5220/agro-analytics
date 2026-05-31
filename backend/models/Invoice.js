import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgroindiOrder', required: true },
  orderNumber: { type: String, default: '' },
  buyerId: { type: String, default: 'guest' },
  buyerName: { type: String, required: true },
  sellerId: { type: String, default: 'guest' },
  sellerName: { type: String, required: true },
  commodity: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
  taxRate: { type: Number, default: 0 }, // GST %
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'cash' }, // placeholder
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date, default: null },
  notes: { type: String, default: '' },
}, { timestamps: true, collection: 'agroindia_invoices' });

invoiceSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 100)}`;
  }
  next();
});

invoiceSchema.index({ orderId: 1 });
invoiceSchema.index({ buyerId: 1, paymentStatus: 1 });

export default mongoose.model('AgroindiInvoice', invoiceSchema);
