const mongoose = require('mongoose');

const cvAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true },
  resumen: { type: String, default: '' },
  skills: [{ type: String }],
  coincidencias: [{ type: String }],
  gaps: [{ type: String }],
  score: { type: Number, default: 0, min: 0, max: 100 },
  recomendacion: {
    type: String,
    enum: ['Recomendado', 'En revisión', 'Descartado'],
    default: 'En revisión',
  },
  jobDescription: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CvAnalysis', cvAnalysisSchema);
