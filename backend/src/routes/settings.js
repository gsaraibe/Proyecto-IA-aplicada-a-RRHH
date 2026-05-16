const express = require('express');
const AppSettings = require('../models/AppSettings');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const settings = await AppSettings.findOne({ key: 'global' });
    const apiKeyIA = settings?.apiKeyIA || process.env.API_KEY_IA || '';
    res.json({ hasApiKey: !!apiKeyIA, apiKeyPreview: apiKeyIA ? `${apiKeyIA.slice(0, 8)}...` : '' });
  } catch {
    res.status(500).json({ message: 'Error al obtener configuración.' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { apiKeyIA } = req.body;
    await AppSettings.findOneAndUpdate(
      { key: 'global' },
      { apiKeyIA },
      { upsert: true, new: true }
    );
    res.json({ message: 'Configuración guardada correctamente.', hasApiKey: !!apiKeyIA });
  } catch {
    res.status(500).json({ message: 'Error al guardar configuración.' });
  }
});

module.exports = router;
