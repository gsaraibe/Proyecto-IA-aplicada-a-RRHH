const mongoose = require('mongoose');

const hrTestSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  email: { type: String, required: true },
  testType: {
    type: String,
    enum: ['personality', 'technical', 'cognitive', 'leadership', 'emotional'],
    required: true
  },
  position: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'expired'],
    default: 'scheduled'
  },
  score: { type: Number, min: 0, max: 100, default: null },
  duration: { type: Number, default: 60 },
  scheduledAt: { type: Date },
  completedAt: { type: Date },
  results: {
    categories: [{
      name: { type: String },
      score: { type: Number }
    }],
    summary: { type: String, default: '' },
    recommendation: { type: String, default: '' },
  },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('HRTest', hrTestSchema);
