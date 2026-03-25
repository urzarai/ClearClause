const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  section: { type: String, default: 'General' },
  plainEnglish: { type: String, default: '' },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: null },
}, { _id: false });

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'txt'], required: true },
    safetyScore: { type: Number, default: null },
    summary: { type: String, default: '' },
    clauses: [clauseSchema],
    namedEntities: {
      parties: [String],
      dates: [String],
      amounts: [String],
      jurisdictions: [String],
    },
    flaggedKeywords: [String],
    topTerms: [{ term: String, score: Number }],
    extractedText: { type: String, default: '' },
    status: {
      type: String,
      enum: ['processing', 'complete', 'error'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);