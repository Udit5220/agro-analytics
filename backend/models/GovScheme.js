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
  id: { type: Number, required: true, unique: true },
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
  details: { type: schemeDetailSchema, required: true }
}, { timestamps: true, collection: 'agroindia_gov_schemes' });

export default mongoose.model('GovScheme', govSchemeSchema);
