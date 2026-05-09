const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || (req.headers.authorization || '').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. Iniciá sesión para continuar.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Sesión expirada. Iniciá sesión nuevamente.' });
  }
};

module.exports = auth;
