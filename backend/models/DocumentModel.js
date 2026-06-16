import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalFileName: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'docx', 'txt'], required: true },
  url: { type: String }, // Path or URL to the stored file
  textExtract: { type: String }, // Extracted text
  summary: {
    executiveSummary: String,
    objective: String,
    methodology: String,
    findings: String,
    keyInsights: [String],
    recommendations: String,
    futureScope: String
  },
  personas: {
    farmer: { type: String },
    trader: { type: String },
    business: { type: String },
    enterprise: { type: String }
  },
  vectorStoreId: { type: String }, // Collection ID in ChromaDB
  views: { type: Number, default: 0 }, // Analytics counter
  metadata: {
    cropType: [String],
    region: [String],
    soilFactor: [String],
    climateImpact: [String],
    tags: [String]
  }, // Auto-generated AI tags
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
