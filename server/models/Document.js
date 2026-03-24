const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  originalText: String,
  plainEnglish: String,
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
}, { _id: false });

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'txt'], required: true },
    safetyScore: { type: Number, default: null },
    summary: { type: String, default: '' },
    clauses: [clauseSchema],
    namedEntities: { type: Object, default: {} },
    flaggedKeywords: [String],
    extractedText: { type: String, default: '' },
    status: { type: String, enum: ['processing', 'complete', 'error'], default: 'processing' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);