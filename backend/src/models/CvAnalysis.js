const mongoose = require('mongoose');

const cvAnalysisSchema = new mongoose.Schema({
  candidateName: { type: String, required: true, trim: true },
  jobTitle: { type: String, default: '', trim: true },
  score: { type: Number, min: 0, max: 100, default: 0 },
  recommendation: {
    type: String,
    enum: ['Recomendado', 'En revisión', 'Descartado'],
    default: 'En revisión',
  },
  summary: { type: String, default: '' },
  skills: [{ type: String }],
  strengths: [{ type: String }],
  gaps: [{ type: String }],
  fullAnalysis: { type: String, default: '' },
  analyzedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CvAnalysis', cvAnalysisSchema);
