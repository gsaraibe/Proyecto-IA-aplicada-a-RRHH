const express = require('express');
const Employee = require('../models/Employee');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const [totalEmployees, activeEmployees, openJobs, totalCandidates, newCandidates] =
      await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ status: 'active' }),
        Job.countDocuments({ status: 'open' }),
        Candidate.countDocuments(),
        Candidate.countDocuments({ status: 'new' }),
      ]);

    const [recentCandidates, recentEmployees, departmentStats, candidatesByStatus] =
      await Promise.all([
        Candidate.find().sort({ createdAt: -1 }).limit(5),
        Employee.find().sort({ createdAt: -1 }).limit(5),
        Employee.aggregate([
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Candidate.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    res.json({
      stats: {
        totalEmployees,
        activeEmployees,
        openJobs,
        totalCandidates,
        newCandidates,
        retentionRate:
          totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0,
      },
      recentCandidates,
      recentEmployees,
      departmentStats,
      candidatesByStatus,
    });
  } catch {
    res.status(500).json({ message: 'Error al obtener estadísticas.' });
  }
});

module.exports = router;
