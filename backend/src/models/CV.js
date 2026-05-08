const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  position: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'hired'],
    default: 'pending'
  },
  score: { type: Number, min: 0, max: 100, default: 0 },
  skills: [{ type: String }],
  experience: { type: Number, default: 0 },
  education: { type: String, default: '' },
  summary: { type: String, default: '' },
  aiAnalysis: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendation: { type: String, default: '' },
    fitScore: { type: Number, default: 0 },
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);
