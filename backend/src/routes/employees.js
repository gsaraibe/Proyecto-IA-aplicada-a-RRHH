const express = require('express');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }
    if (department && department !== 'all') query.department = department;
    if (status && status !== 'all') query.status = status;

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json({ employees });
  } catch {
    res.status(500).json({ message: 'Error al obtener empleados.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ employee });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: 'Ya existe un empleado con ese email.' });
    res.status(500).json({ message: 'Error al crear empleado.' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Empleado no encontrado.' });
    res.json({ employee });
  } catch {
    res.status(500).json({ message: 'Error al obtener empleado.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ employee });
  } catch {
    res.status(500).json({ message: 'Error al actualizar empleado.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Empleado eliminado.' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar empleado.' });
  }
});

module.exports = router;
