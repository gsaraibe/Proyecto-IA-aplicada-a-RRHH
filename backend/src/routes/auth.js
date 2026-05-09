const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });

    if (password.length < 6)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Ya existe una cuenta con ese email.' });

    const user = await User.create({ name, email, password });
    setCookie(res, createToken(user._id));

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch {
    res.status(500).json({ message: 'Error al crear la cuenta. Intentá de nuevo.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Email o contraseña incorrectos.' });

    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ message: 'Email o contraseña incorrectos.' });

    setCookie(res, createToken(user._id));

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch {
    res.status(500).json({ message: 'Error al iniciar sesión. Intentá de nuevo.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada correctamente.' });
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, department, position, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, department, position, bio },
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Error al guardar el perfil.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  res.json({ message: 'Si el email existe en nuestro sistema, recibirás instrucciones pronto.' });
});

module.exports = router;
