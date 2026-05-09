const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  position: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'vacation'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  salary: { type: Number, default: 0 },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  manager: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
