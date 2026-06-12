import mongoose from 'mongoose';

const schemeDetailSchema = new mongoose.Schema({
  authority: { type: String, default: '' },
  description: { type: String, default: '' },
  benefits: { type: mongoose.Schema.Types.Mixed },
  eligibility: { type: mongoose.Schema.Types.Mixed },
  eligibilityMatrix: { type: mongoose.Schema.Types.Mixed },
  exclusions: { type: mongoose.Schema.Types.Mixed },
  documents: { type: mongoose.Schema.Types.Mixed },
  timeline: { type: mongoose.Schema.Types.Mixed },
  faqs: { type: mongoose.Schema.Types.Mixed },
  launchYear: { type: mongoose.Schema.Types.Mixed },
  target: { type: String, default: '' },
  budget: { type: String, default: '' },
  ministry: { type: String, default: '' }
});

const govSchemeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryColor: { type: String, default: '#132a13' },
  dept: { type: String, required: true },
  benefit: { type: String, required: true },
  matchScore: { type: Number, default: 100 },
  status: { type: String, default: 'Not Applied' },
  statusType: { type: String, default: 'not_applied' },
  deadline: { type: String, default: 'Ongoing' },
  docsRequired: { type: Number, default: 0 },
  docsUploaded: { type: Number, default: 0 },
  estApproval: { type: String, default: '15-30 days' },
  details: { type: schemeDetailSchema, required: false },
  
  // Corporate and Role metadata fields
  isFarmerScheme: { type: Boolean, default: true },
  level: { type: String, default: 'Central Government' },
  benefitType: { type: String, default: '' },
  benefitAmount: { type: String, default: '' },
  daysLeft: { type: Number, default: 0 },
  lastInteraction: { type: String, default: '' },
  potValue: { type: Number, default: 0 },
  eligibilitySnapshot: { type: String, default: '' },
  selfReportedApplied: { type: Boolean, default: false },
  bookmarked: { type: Boolean, default: false },
  
  // Dynamic counter overrides (fallback/live synced)
  viewed: { type: Number, default: 0 },
  guideOpened: { type: Number, default: 0 },
  applyClicked: { type: Number, default: 0 },
  farmerSavedCount: { type: Number, default: 0 }
}, { timestamps: true, collection: 'agroindia_gov_schemes' });

export default mongoose.model('GovScheme', govSchemeSchema);
