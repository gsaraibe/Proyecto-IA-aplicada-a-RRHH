require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const seedDB = require('./seeds');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const jobRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidates');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

connectDB().then(() => seedDB());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'TalentAI', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TalentAI Backend corriendo en puerto ${PORT}`);
});
