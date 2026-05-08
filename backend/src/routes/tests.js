const express = require('express');
const HRTest = require('../models/HRTest');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { status, testType, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (testType) filter.testType = testType;
    const total = await HRTest.countDocuments(filter);
    const tests = await HRTest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ tests, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pruebas.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const test = await HRTest.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Prueba no encontrada.' });
    res.json({ test });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener prueba.' });
  }
});

module.exports = router;
