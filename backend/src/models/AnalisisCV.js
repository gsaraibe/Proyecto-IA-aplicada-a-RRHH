const mongoose = require('mongoose');

const analisisCVSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true },
  puesto:    { type: String, required: true, trim: true },
  score:     { type: Number, default: 0, min: 0, max: 100 },
  estado:    { type: String, enum: ['recomendado', 'descartado', 'pendiente'], default: 'pendiente' },
  resumenIA: { type: String, default: '' },
  fecha:     { type: Date, default: Date.now },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('AnalisisCV', analisisCVSchema);
