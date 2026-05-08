require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const cvRoutes = require('./routes/cvs');
const testRoutes = require('./routes/tests');

const app = express();

connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/tests', testRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TalentStream API corriendo en puerto ${PORT}`));
