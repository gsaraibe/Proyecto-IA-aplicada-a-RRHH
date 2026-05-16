const express = require('express');
const OnboardingPlan = require('../models/OnboardingPlan');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const plans = await OnboardingPlan.find().sort({ createdAt: -1 });
    res.json({ plans });
  } catch {
    res.status(500).json({ message: 'Error al obtener planes.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await OnboardingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan no encontrado.' });
    res.json({ plan });
  } catch {
    res.status(500).json({ message: 'Error al obtener plan.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body, savedBy: req.user._id };
    const plan = await OnboardingPlan.create(data);
    res.status(201).json({ plan });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar plan: ' + err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await OnboardingPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ plan });
  } catch {
    res.status(500).json({ message: 'Error al actualizar plan.' });
  }
});

// Update a single task's completed state
router.patch('/:id/tasks/:taskId', auth, async (req, res) => {
  try {
    const { completed } = req.body;
    const plan = await OnboardingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan no encontrado.' });

    let found = false;
    for (const week of plan.weeks) {
      const task = week.tasks.id(req.params.taskId);
      if (task) {
        task.completed = completed;
        found = true;
        break;
      }
    }
    if (!found) return res.status(404).json({ message: 'Tarea no encontrada.' });

    await plan.save();
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea: ' + err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await OnboardingPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan eliminado.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar plan.' });
  }
});

module.exports = router;
