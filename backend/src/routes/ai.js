const express = require('express');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const AdmZip = require('adm-zip');
const AppSettings = require('../models/AppSettings');
const auth = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed'];
    const allowedExt = ['.pdf', '.docx', '.zip'];
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (allowed.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Usá PDF, DOCX o ZIP.'));
    }
  },
});

async function getApiKey() {
  const settings = await AppSettings.findOne({ key: 'global' });
  return settings?.apiKeyIA || process.env.API_KEY_IA || '';
}

async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  try {
    if (ext === 'pdf') {
      const data = await pdfParse(buffer);
      return data.text || '';
    }
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    }
  } catch {
    return '';
  }
  return '';
}

async function extractText(file) {
  return extractTextFromBuffer(file.buffer, file.originalname);
}

async function analyzeCV(userPrompt, cvText, jobDesc, fileName) {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('No hay API Key configurada. Configurala en Ajustes.');

  const client = new Anthropic({ apiKey });

  const fullPrompt = `${userPrompt}

---

DESCRIPCIÓN DEL PUESTO:
${jobDesc || 'No se proporcionó descripción del puesto.'}

---

CV DEL CANDIDATO (${fileName}):
${cvText || 'No se pudo extraer texto del archivo.'}

---

RESPUESTA ESTRUCTURADA REQUERIDA:
Además del análisis completo arriba, incluí al final de tu respuesta un bloque JSON con este formato exacto (no modifiques los nombres de las propiedades):

\`\`\`json
{
  "candidateName": "nombre o identificador del candidato (usá iniciales si es anónimo)",
  "score": 75,
  "recommendation": "Recomendado",
  "summary": "Resumen del perfil en 2-4 oraciones.",
  "skills": ["skill1", "skill2", "skill3"],
  "strengths": ["fortaleza con evidencia del CV", "otra fortaleza"],
  "gaps": ["gap o punto a validar", "otro gap"]
}
\`\`\`

IMPORTANTE: recommendation debe ser exactamente uno de estos valores: "Recomendado", "En revisión", o "Descartado". El score debe ser un número entre 0 y 100.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: fullPrompt }],
  });

  const responseText = response.content[0].text;

  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
  let parsed = {};
  if (jsonMatch) {
    try { parsed = JSON.parse(jsonMatch[1]); } catch { /* continue with empty */ }
  }

  const validRecs = ['Recomendado', 'En revisión', 'Descartado'];
  const recommendation = validRecs.includes(parsed.recommendation) ? parsed.recommendation : 'En revisión';
  const score = typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 0;

  return {
    candidateName: parsed.candidateName || fileName.replace(/\.[^.]+$/, ''),
    score,
    recommendation,
    summary: parsed.summary || '',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    fullAnalysis: responseText,
  };
}

// POST /api/ai/analyze-cv
router.post(
  '/analyze-cv',
  auth,
  upload.fields([
    { name: 'cvFiles', maxCount: 20 },
    { name: 'jobDescFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { prompt, jobDescText } = req.body;
      const cvFiles = req.files?.['cvFiles'] || [];
      const jobDescFile = req.files?.['jobDescFile']?.[0];

      let jobDescContent = jobDescText || '';
      if (jobDescFile) {
        jobDescContent = await extractText(jobDescFile);
      }

      if (cvFiles.length === 0) {
        return res.status(400).json({ message: 'Debés subir al menos un CV.' });
      }

      const cvTexts = [];

      for (const file of cvFiles) {
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (ext === 'zip') {
          try {
            const zip = new AdmZip(file.buffer);
            const entries = zip.getEntries();
            for (const entry of entries) {
              if (!entry.isDirectory) {
                const entryExt = entry.name.split('.').pop().toLowerCase();
                if (['pdf', 'docx'].includes(entryExt)) {
                  const text = await extractTextFromBuffer(entry.getData(), entry.name);
                  if (text.trim()) cvTexts.push({ name: entry.name, text });
                }
              }
            }
          } catch {
            // Skip malformed ZIP
          }
        } else {
          const text = await extractText(file);
          if (text.trim()) cvTexts.push({ name: file.originalname, text });
        }
      }

      if (cvTexts.length === 0) {
        return res.status(400).json({ message: 'No se pudo extraer texto de los archivos. Verificá que sean PDF o DOCX válidos.' });
      }

      const results = [];
      for (const cv of cvTexts) {
        const result = await analyzeCV(prompt || '', cv.text, jobDescContent, cv.name);
        results.push(result);
      }

      res.json({ results });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error al analizar CV.' });
    }
  }
);

// POST /api/ai/generate-onboarding
router.post('/generate-onboarding', auth, async (req, res) => {
  try {
    const { employeeName, position, department, startDate, prompt } = req.body;

    const apiKey = await getApiKey();
    if (!apiKey) throw new Error('No hay API Key configurada. Configurala en Ajustes.');

    const client = new Anthropic({ apiKey });

    const fullPrompt = `${prompt || ''}

---

DATOS DEL NUEVO COLABORADOR:
- Nombre: ${employeeName}
- Puesto: ${position}
- Área/Departamento: ${department}
- Fecha de ingreso: ${startDate}

---

RESPUESTA ESTRUCTURADA REQUERIDA:
Además del plan completo, incluí al final un bloque JSON con este formato exacto:

\`\`\`json
{
  "weeks": [
    {
      "number": 1,
      "title": "Semana 1 - Título de la etapa",
      "objective": "Objetivo principal de esta semana",
      "tasks": [
        { "text": "Descripción concreta de la tarea", "responsible": "RRHH / Líder / IT" },
        { "text": "Otra tarea", "responsible": "Líder" }
      ],
      "expectedResult": "Resultado esperado al finalizar la semana"
    },
    {
      "number": 2,
      "title": "Semana 2 - Título",
      "objective": "...",
      "tasks": [],
      "expectedResult": "..."
    },
    {
      "number": 3,
      "title": "Semana 3 - Título",
      "objective": "...",
      "tasks": [],
      "expectedResult": "..."
    },
    {
      "number": 4,
      "title": "Semana 4 - Título",
      "objective": "...",
      "tasks": [],
      "expectedResult": "..."
    }
  ]
}
\`\`\`

IMPORTANTE: Cada semana debe tener entre 4 y 6 tareas concretas y aplicables al puesto y área indicados.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 6000,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    const responseText = response.content[0].text;

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    let parsed = { weeks: [] };
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[1]); } catch { /* use empty */ }
    }

    const weeks = (parsed.weeks || []).map((w) => ({
      number: w.number,
      title: w.title || `Semana ${w.number}`,
      objective: w.objective || '',
      tasks: (w.tasks || []).map((t) => ({
        text: typeof t === 'string' ? t : t.text,
        responsible: t.responsible || '',
        completed: false,
      })),
      expectedResult: w.expectedResult || '',
    }));

    res.json({ weeks, fullPlan: responseText });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error al generar plan de onboarding.' });
  }
});

module.exports = router;
