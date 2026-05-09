const express = require('express');
const AnalisisCV = require('../models/AnalisisCV');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/cv-analisis/stats — métricas del dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const usuarioId = req.user._id;

    const [total, recomendados, descartados, scoreAgg] = await Promise.all([
      AnalisisCV.countDocuments({ usuarioId }),
      AnalisisCV.countDocuments({ usuarioId, estado: 'recomendado' }),
      AnalisisCV.countDocuments({ usuarioId, estado: 'descartado' }),
      AnalisisCV.aggregate([
        { $match: { usuarioId } },
        { $group: { _id: null, promedio: { $avg: '$score' } } },
      ]),
    ]);

    const scorePromedio = scoreAgg.length > 0 ? Math.round(scoreAgg[0].promedio) : 0;

    res.json({ total, recomendados, descartados, scorePromedio });
  } catch {
    res.status(500).json({ message: 'Error al obtener estadísticas.' });
  }
});

// GET /api/cv-analisis — candidatos del usuario con filtros opcionales
router.get('/', auth, async (req, res) => {
  try {
    const { estado, puesto } = req.query;
    const query = { usuarioId: req.user._id };

    if (estado && estado !== 'todos') query.estado = estado;
    if (puesto && puesto.trim()) query.puesto = { $regex: puesto.trim(), $options: 'i' };

    const analisis = await AnalisisCV.find(query).sort({ fecha: -1 });
    res.json({ analisis });
  } catch {
    res.status(500).json({ message: 'Error al obtener análisis.' });
  }
});

// POST /api/cv-analisis — crear nuevo análisis
router.post('/', auth, async (req, res) => {
  try {
    const analisis = await AnalisisCV.create({ ...req.body, usuarioId: req.user._id });
    res.status(201).json({ analisis });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear análisis.' });
  }
});

module.exports = router;
