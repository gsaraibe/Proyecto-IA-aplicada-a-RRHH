const express = require('express');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { search, status, jobId } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') query.status = status;
    if (jobId) query.jobId = jobId;

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json({ candidates });
  } catch {
    res.status(500).json({ message: 'Error al obtener candidatos.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    if (req.body.jobId) {
      await Job.findByIdAndUpdate(req.body.jobId, { $inc: { applicants: 1 } });
    }
    res.status(201).json({ candidate });
  } catch {
    res.status(500).json({ message: 'Error al crear candidato.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ candidate });
  } catch {
    res.status(500).json({ message: 'Error al actualizar candidato.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidato eliminado.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar candidato.' });
  }
});

module.exports = router;
