const express = require('express');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const auth = require('../middleware/auth');
const CvAnalysis = require('../models/CvAnalysis');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
const client = new Anthropic();

const SYSTEM_PROMPT = `Sos un experto en Recursos Humanos especializado en análisis de CVs. Analizás currículums y los evaluás en base a la descripción del puesto proporcionada.

Devolvés SIEMPRE un JSON válido con exactamente esta estructura, sin texto adicional:
{
  "nombre": "nombre completo del candidato, o 'Candidato sin nombre' si no se encontró",
  "resumen": "resumen profesional del candidato en 2-3 oraciones",
  "skills": ["habilidad1", "habilidad2"],
  "coincidencias": ["requisito del puesto que el candidato cumple"],
  "gaps": ["requisito del puesto que al candidato le falta"],
  "score": 75,
  "recomendacion": "Recomendado"
}

El score va de 0 a 100. La recomendación debe ser exactamente: "Recomendado", "En revisión" o "Descartado".
Respondé solo con el JSON, sin markdown ni texto extra.`;

async function callClaude(messages) {
  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 2048,
    thinking: { type: 'adaptive' },
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages,
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('La IA no devolvió respuesta.');

  const match = textBlock.text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Respuesta de IA con formato inválido.');

  return JSON.parse(match[0]);
}

async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (ext === 'docx' || ext === 'doc') {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error(`Formato no soportado: ${ext}`);
}

// GET /api/hr-intelligence
router.get('/', auth, async (req, res) => {
  try {
    const analyses = await CvAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ analyses });
  } catch {
    res.status(500).json({ message: 'Error al obtener análisis.' });
  }
});

// POST /api/hr-intelligence/analyze
router.post('/analyze', auth, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se recibió ningún archivo.' });
    const { jobDescription } = req.body;
    if (!jobDescription?.trim()) return res.status(400).json({ message: 'La descripción del puesto es requerida.' });

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const results = [];

    if (ext === 'zip') {
      const AdmZip = require('adm-zip');
      const zip = new AdmZip(req.file.buffer);
      const entries = zip.getEntries().filter((e) => {
        if (e.isDirectory) return false;
        const entryExt = e.entryName.split('.').pop().toLowerCase();
        return ['pdf', 'docx', 'doc'].includes(entryExt);
      });

      if (entries.length === 0) return res.status(400).json({ message: 'El ZIP no contiene archivos PDF o DOCX.' });

      for (const entry of entries) {
        const text = await extractTextFromBuffer(entry.getData(), entry.entryName);
        const analysis = await callClaude([{
          role: 'user',
          content: `CV del candidato:\n\n${text}\n\n---\n\nDescripción del puesto:\n\n${jobDescription}`,
        }]);
        results.push(analysis);
      }
    } else if (['jpg', 'jpeg', 'png'].includes(ext)) {
      const mediaType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      const analysis = await callClaude([{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: req.file.buffer.toString('base64') },
          },
          { type: 'text', text: `Este es el CV del candidato. Analizalo en base a la siguiente descripción del puesto:\n\n${jobDescription}` },
        ],
      }]);
      results.push(analysis);
    } else {
      const text = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
      const analysis = await callClaude([{
        role: 'user',
        content: `CV del candidato:\n\n${text}\n\n---\n\nDescripción del puesto:\n\n${jobDescription}`,
      }]);
      results.push(analysis);
    }

    res.json({ results });
  } catch (err) {
    console.error('Error en análisis de CV:', err);
    res.status(500).json({ message: err.message || 'Error al analizar el CV.' });
  }
});

// POST /api/hr-intelligence/save
router.post('/save', auth, async (req, res) => {
  try {
    const { nombre, resumen, skills, coincidencias, gaps, score, recomendacion, jobDescription } = req.body;
    const analysis = await CvAnalysis.create({
      userId: req.user._id,
      nombre, resumen, skills, coincidencias, gaps, score, recomendacion, jobDescription,
    });
    res.status(201).json({ analysis });
  } catch {
    res.status(500).json({ message: 'Error al guardar el análisis.' });
  }
});

// DELETE /api/hr-intelligence/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await CvAnalysis.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Análisis eliminado.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar.' });
  }
});

module.exports = router;
