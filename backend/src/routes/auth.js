const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
    const user = await User.create({ name, email, password, role, department });
    const token = signToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario.', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Cuenta desactivada.' });
    }
    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión.', error: err.message });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

router.put('/me', protect, async (req, res) => {
  try {
    const { name, department, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, department, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar perfil.', error: err.message });
  }
});

module.exports = router;
