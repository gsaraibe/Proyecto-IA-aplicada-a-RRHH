const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch {
    res.status(500).json({ message: 'Error al obtener vacantes.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ job });
  } catch {
    res.status(500).json({ message: 'Error al crear vacante.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ job });
  } catch {
    res.status(500).json({ message: 'Error al actualizar vacante.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vacante eliminada.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar vacante.' });
  }
});

module.exports = router;
