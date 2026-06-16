import mongoose from 'mongoose';

const researchQueryLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  userRole: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, enum: ['search', 'chat'], default: 'search' },
  processingTimeMs: { type: Number, default: 0 },
  resultsCount: { type: Number, default: 0 },
  filters: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const ResearchQueryLog = mongoose.model('ResearchQueryLog', researchQueryLogSchema);

export default ResearchQueryLog;
