const express = require('express');
const CV = require('../models/CV');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { status, position, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (position) filter.position = new RegExp(position, 'i');
    if (search) {
      filter.$or = [
        { candidateName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') },
      ];
    }
    const total = await CV.countDocuments(filter);
    const cvs = await CV.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ cvs, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener CVs.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) return res.status(404).json({ message: 'CV no encontrado.' });
    res.json({ cv });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener CV.' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const cv = await CV.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!cv) return res.status(404).json({ message: 'CV no encontrado.' });
    res.json({ cv });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado.' });
  }
});

module.exports = router;
