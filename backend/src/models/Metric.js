const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  applicants: { type: Number, default: 0 },
  hired: { type: Number, default: 0 },
  rejected: { type: Number, default: 0 },
  avgTimeToHire: { type: Number, default: 0 },
  openPositions: { type: Number, default: 0 },
  testsCompleted: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Metric', metricSchema);
