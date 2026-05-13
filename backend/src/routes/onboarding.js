const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const auth = require('../middleware/auth');
const OnboardingPlan = require('../models/OnboardingPlan');

const router = express.Router();
const client = new Anthropic();

const SYSTEM_PROMPT = `Sos un experto en Recursos Humanos especializado en planes de onboarding. Creás planes de incorporación de 30 días estructurados en exactamente 4 semanas.

Devolvés SIEMPRE un JSON válido con exactamente esta estructura, sin texto adicional:
{
  "empleado": "nombre del empleado",
  "puesto": "nombre del puesto",
  "semanas": [
    {
      "numero": 1,
      "titulo": "Título descriptivo de la semana",
      "tareas": ["tarea específica 1", "tarea específica 2", "tarea específica 3"]
    }
  ]
}

Generá exactamente 4 semanas. Cada semana debe tener entre 5 y 7 tareas concretas y accionables, específicas para el puesto y área indicados.
Respondé solo con el JSON, sin markdown ni texto extra.`;

async function generatePlan(empleado, puesto, area, fechaIngreso) {
  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 3000,
    thinking: { type: 'adaptive' },
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: `Generá un plan de onboarding de 30 días para:
- Empleado: ${empleado}
- Puesto: ${puesto}
- Área: ${area || 'General'}
- Fecha de ingreso: ${fechaIngreso || 'próxima semana'}`,
    }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('La IA no devolvió respuesta.');

  const match = textBlock.text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Respuesta de IA con formato inválido.');

  return JSON.parse(match[0]);
}

function calcProgress(plan) {
  const total = plan.semanas.reduce((s, sem) => s + sem.tareas.length, 0);
  const done = plan.semanas.reduce((s, sem) => s + sem.tareas.filter((t) => t.completada).length, 0);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

// GET /api/onboarding
router.get('/', auth, async (req, res) => {
  try {
    const plans = await OnboardingPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ plans });
  } catch {
    res.status(500).json({ message: 'Error al obtener planes.' });
  }
});

// GET /api/onboarding/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await OnboardingPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan no encontrado.' });
    res.json({ plan });
  } catch {
    res.status(500).json({ message: 'Error al obtener plan.' });
  }
});

// POST /api/onboarding/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const { empleado, puesto, area, fechaIngreso } = req.body;
    if (!empleado?.trim() || !puesto?.trim()) {
      return res.status(400).json({ message: 'El nombre del empleado y el puesto son requeridos.' });
    }

    const planData = await generatePlan(empleado, puesto, area, fechaIngreso);

    const semanas = planData.semanas.map((s) => ({
      numero: s.numero,
      titulo: s.titulo,
      tareas: s.tareas.map((t) => ({
        texto: typeof t === 'string' ? t : t.texto,
        completada: false,
      })),
    }));

    const plan = await OnboardingPlan.create({
      userId: req.user._id,
      empleado: planData.empleado || empleado,
      puesto: planData.puesto || puesto,
      area: area || '',
      fechaIngreso: fechaIngreso ? new Date(fechaIngreso) : undefined,
      semanas,
      progreso: 0,
    });

    res.status(201).json({ plan });
  } catch (err) {
    console.error('Error generando plan de onboarding:', err);
    res.status(500).json({ message: err.message || 'Error al generar el plan.' });
  }
});

// PUT /api/onboarding/:id/task
router.put('/:id/task', auth, async (req, res) => {
  try {
    const { semanaIndex, tareaIndex, completada } = req.body;
    const plan = await OnboardingPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan no encontrado.' });

    plan.semanas[semanaIndex].tareas[tareaIndex].completada = completada;
    plan.progreso = calcProgress(plan);
    plan.markModified('semanas');
    await plan.save();

    res.json({ plan });
  } catch {
    res.status(500).json({ message: 'Error al actualizar tarea.' });
  }
});

// DELETE /api/onboarding/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await OnboardingPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Plan eliminado.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar plan.' });
  }
});

module.exports = router;
