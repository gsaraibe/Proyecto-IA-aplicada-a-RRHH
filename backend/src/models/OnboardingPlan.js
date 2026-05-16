const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  responsible: { type: String, default: '' },
  completed: { type: Boolean, default: false },
}, { _id: true });

const weekSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  objective: { type: String, default: '' },
  tasks: [taskSchema],
  expectedResult: { type: String, default: '' },
}, { _id: false });

const onboardingPlanSchema = new mongoose.Schema({
  employeeName: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  weeks: [weekSchema],
  fullPlan: { type: String, default: '' },
  savedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('OnboardingPlan', onboardingPlanSchema);
