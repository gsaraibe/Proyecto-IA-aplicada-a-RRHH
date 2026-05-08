const express = require('express');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', requireRole('admin', 'manager'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});

module.exports = router;
