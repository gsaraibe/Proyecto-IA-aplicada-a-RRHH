const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, default: '' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  jobTitle: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'],
    default: 'new',
  },
  score: { type: Number, default: 0, min: 0, max: 100 },
  notes: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  skills: [{ type: String }],
  source: { type: String, enum: ['linkedin', 'referido', 'web', 'portal', 'otro'], default: 'web' },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
