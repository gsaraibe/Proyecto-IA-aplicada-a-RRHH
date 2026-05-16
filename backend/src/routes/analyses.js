const express = require('express');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const CvAnalysis = require('../models/CvAnalysis');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { search, recommendation, scoreMin, scoreMax } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { candidateName: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
      ];
    }
    if (recommendation && recommendation !== 'Todos') {
      query.recommendation = recommendation;
    }
    if (scoreMin !== undefined || scoreMax !== undefined) {
      query.score = {};
      if (scoreMin !== undefined) query.score.$gte = Number(scoreMin);
      if (scoreMax !== undefined) query.score.$lte = Number(scoreMax);
    }

    const analyses = await CvAnalysis.find(query).sort({ createdAt: -1 });
    res.json({ analyses });
  } catch {
    res.status(500).json({ message: 'Error al obtener análisis.' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const total = await CvAnalysis.countDocuments();
    const recommended = await CvAnalysis.countDocuments({ recommendation: 'Recomendado' });
    const inReview = await CvAnalysis.countDocuments({ recommendation: 'En revisión' });
    const scoreAgg = await CvAnalysis.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } },
    ]);
    const avgScore = scoreAgg[0]?.avg ? Math.round(scoreAgg[0].avg) : 0;

    res.json({ total, recommended, inReview, avgScore });
  } catch {
    res.status(500).json({ message: 'Error al obtener estadísticas.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await CvAnalysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: 'Análisis no encontrado.' });
    res.json({ analysis });
  } catch {
    res.status(500).json({ message: 'Error al obtener análisis.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const data = { ...req.body, analyzedBy: req.user._id };
    const analysis = await CvAnalysis.create(data);
    res.status(201).json({ analysis });
  } catch {
    res.status(500).json({ message: 'Error al guardar análisis.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await CvAnalysis.findByIdAndDelete(req.params.id);
    res.json({ message: 'Análisis eliminado.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar análisis.' });
  }
});

router.post('/export/excel', auth, async (req, res) => {
  try {
    const { analyses: data } = req.body;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CH Assist';
    const sheet = workbook.addWorksheet('Análisis de CVs');

    sheet.columns = [
      { header: 'Candidato', key: 'candidateName', width: 25 },
      { header: 'Puesto', key: 'jobTitle', width: 30 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Recomendación', key: 'recommendation', width: 18 },
      { header: 'Resumen', key: 'summary', width: 50 },
      { header: 'Skills', key: 'skills', width: 40 },
      { header: 'Fortalezas', key: 'strengths', width: 40 },
      { header: 'Gaps', key: 'gaps', width: 40 },
      { header: 'Fecha', key: 'date', width: 18 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern', pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    (data || []).forEach((a) => {
      sheet.addRow({
        candidateName: a.candidateName,
        jobTitle: a.jobTitle,
        score: a.score,
        recommendation: a.recommendation,
        summary: a.summary,
        skills: (a.skills || []).join(', '),
        strengths: (a.strengths || []).join(' | '),
        gaps: (a.gaps || []).join(' | '),
        date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('es-AR') : '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="analisis-cvs.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Error al exportar Excel: ' + err.message });
  }
});

router.post('/export/pdf', auth, (req, res) => {
  try {
    const { analysis: a } = req.body;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="analisis-${(a.candidateName || 'cv').replace(/\s+/g, '-')}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#4F46E5').text('CH Assist — Análisis de CV', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#374151').text(`Candidato: ${a.candidateName}`, { align: 'center' });
    doc.fontSize(10).fillColor('#6B7280').text(`Puesto: ${a.jobTitle || 'No especificado'}  |  Fecha: ${new Date().toLocaleDateString('es-AR')}`, { align: 'center' });
    doc.moveDown(1);

    // Score & Recommendation
    doc.fontSize(14).fillColor('#111827').text('Resultado del Análisis');
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor('#374151').text(`Score: ${a.score}/100   |   Recomendación: ${a.recommendation}`);
    doc.moveDown(0.8);

    // Summary
    if (a.summary) {
      doc.fontSize(13).fillColor('#111827').text('Resumen del perfil');
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#4B5563').text(a.summary);
      doc.moveDown(0.8);
    }

    // Skills
    if (a.skills?.length) {
      doc.fontSize(13).fillColor('#111827').text('Skills principales');
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('#4B5563').text(a.skills.join('  •  '));
      doc.moveDown(0.8);
    }

    // Strengths
    if (a.strengths?.length) {
      doc.fontSize(13).fillColor('#059669').text('Coincidencias con el puesto');
      doc.moveDown(0.3);
      a.strengths.forEach((s) => {
        doc.fontSize(10).fillColor('#4B5563').text(`✓ ${s}`);
      });
      doc.moveDown(0.8);
    }

    // Gaps
    if (a.gaps?.length) {
      doc.fontSize(13).fillColor('#DC2626').text('Gaps o puntos a validar');
      doc.moveDown(0.3);
      a.gaps.forEach((g) => {
        doc.fontSize(10).fillColor('#4B5563').text(`✗ ${g}`);
      });
      doc.moveDown(0.8);
    }

    // Full analysis
    if (a.fullAnalysis) {
      doc.addPage();
      doc.fontSize(14).fillColor('#111827').text('Análisis completo generado por IA');
      doc.moveDown(0.5);
      doc.fontSize(9).fillColor('#4B5563').text(a.fullAnalysis, { lineGap: 3 });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error al exportar PDF: ' + err.message });
  }
});

module.exports = router;
