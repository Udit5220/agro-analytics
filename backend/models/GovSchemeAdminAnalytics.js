import mongoose from 'mongoose';

const govSchemeAdminAnalyticsSchema = new mongoose.Schema({
  companyId: { type: String, default: 'guest', unique: true },
  profileStrength: { type: Number, default: 82 },
  companyProfile: { type: mongoose.Schema.Types.Mixed, default: {} },
  missedOpportunities: { type: mongoose.Schema.Types.Mixed, default: [] },
  outreach: { type: mongoose.Schema.Types.Mixed, default: {} },
  campaigns: { type: mongoose.Schema.Types.Mixed, default: [] },
  farmers: { type: mongoose.Schema.Types.Mixed, default: [] },
  updates: { type: mongoose.Schema.Types.Mixed, default: [] },
  alerts: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true, collection: 'agroindia_gov_scheme_admin_analytics' });

export default mongoose.model('GovSchemeAdminAnalytics', govSchemeAdminAnalyticsSchema);
