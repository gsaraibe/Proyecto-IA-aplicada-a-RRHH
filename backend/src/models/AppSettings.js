const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'global' },
  apiKeyIA: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AppSettings', appSettingsSchema);
