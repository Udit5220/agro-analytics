import mongoose from 'mongoose';

const promptTemplateSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  systemInstruction: { type: String, required: true },
  safetyRules: { type: String },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'System Admin' }
});

const PromptTemplate = mongoose.model('PromptTemplate', promptTemplateSchema);

export default PromptTemplate;
