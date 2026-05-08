const express = require('express');
const CV = require('../models/CV');
const HRTest = require('../models/HRTest');
const Metric = require('../models/Metric');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/stats', async (req, res) => {
  try {
    const [
      totalCVs,
      pendingCVs,
      approvedCVs,
      rejectedCVs,
      hiredCVs,
      totalTests,
      completedTests,
      scheduledTests,
    ] = await Promise.all([
      CV.countDocuments(),
      CV.countDocuments({ status: 'pending' }),
      CV.countDocuments({ status: 'approved' }),
      CV.countDocuments({ status: 'rejected' }),
      CV.countDocuments({ status: 'hired' }),
      HRTest.countDocuments(),
      HRTest.countDocuments({ status: 'completed' }),
      HRTest.countDocuments({ status: 'scheduled' }),
    ]);

    const avgScoreResult = await CV.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } }
    ]);
    const avgScore = avgScoreResult[0]?.avg?.toFixed(1) || 0;

    const positionStats = await CV.aggregate([
      { $group: { _id: '$position', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const statusDistribution = await CV.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentCVs = await CV.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('candidateName position status score createdAt');

    const recentTests = await HRTest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('candidateName testType status score scheduledAt');

    const metrics = await Metric.find()
      .sort({ year: 1 })
      .limit(12);

    res.json({
      summary: {
        totalCVs,
        pendingCVs,
        approvedCVs,
        rejectedCVs,
        hiredCVs,
        totalTests,
        completedTests,
        scheduledTests,
        avgScore: Number(avgScore),
        conversionRate: totalCVs > 0 ? ((hiredCVs / totalCVs) * 100).toFixed(1) : 0,
      },
      positionStats,
      statusDistribution,
      recentCVs,
      recentTests,
      metrics,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas.', error: err.message });
  }
});

module.exports = router;
