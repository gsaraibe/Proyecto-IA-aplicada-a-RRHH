const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: { type: String, default: 'Buenos Aires, Argentina' },
  type: { type: String, enum: ['full-time', 'part-time', 'remote', 'hybrid'], default: 'full-time' },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open' },
  applicants: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
