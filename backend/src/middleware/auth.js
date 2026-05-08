const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado. Token requerido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Usuario no encontrado o inactivo.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
  }
  next();
};

module.exports = { protect, requireRole };
