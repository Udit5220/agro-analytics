import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, default: 'guest' }, // Will be ObjectId when auth is added
  commodity: { type: String, required: true },
  mandiName: { type: String, required: true },
  targetPrice: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  currentModalPrice: { type: Number, default: 0 },
}, { timestamps: true, collection: 'agroindia_watchlists' });

watchlistSchema.index({ userId: 1 });
watchlistSchema.index({ commodity: 1 });

export default mongoose.model('AgroindiWatchlist', watchlistSchema);
