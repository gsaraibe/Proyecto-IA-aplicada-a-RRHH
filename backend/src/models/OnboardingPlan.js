const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  completada: { type: Boolean, default: false },
}, { _id: false });

const semanaSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  titulo: { type: String, required: true },
  tareas: [tareaSchema],
}, { _id: false });

const onboardingPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  empleado: { type: String, required: true },
  puesto: { type: String, required: true },
  area: { type: String, default: '' },
  fechaIngreso: { type: Date },
  semanas: [semanaSchema],
  progreso: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

module.exports = mongoose.model('OnboardingPlan', onboardingPlanSchema);
