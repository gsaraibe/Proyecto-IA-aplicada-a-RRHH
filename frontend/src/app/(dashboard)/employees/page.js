'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { PageLoader } from '@/components/ui/Loader';
import { Plus, Search, Mail, Phone, MapPin, Trash2, UserPlus, Users } from 'lucide-react';

const DEPARTMENTS = ['Tecnología', 'Diseño', 'Marketing', 'Ventas', 'Finanzas', 'Recursos Humanos', 'Producto', 'Operaciones'];
const STATUSES = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'vacation', label: 'Vacaciones' },
  { value: 'inactive', label: 'Inactivos' },
];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  position: '', department: DEPARTMENTS[0], status: 'active',
  location: '', salary: '', skills: '', manager: '',
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchEmployees = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (deptFilter !== 'all') params.set('department', deptFilter);
      const { employees } = await api.get(`/employees?${params}`);
      setEmployees(employees);
    } catch {
      setFeedback({ type: 'error', msg: 'Error al cargar empleados.' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, deptFilter]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        salary: Number(form.salary) || 0,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      await api.post('/employees', payload);
      setFeedback({ type: 'success', msg: 'Empleado agregado correctamente.' });
      setModal(false);
      setForm(EMPTY_FORM);
      fetchEmployees();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/employees/${id}`);
      setFeedback({ type: 'success', msg: 'Empleado eliminado.' });
      fetchEmployees();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar empleado.' });
    }
  };

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const inputCls = 'input-base text-sm';

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Empleados</h2>
          <p className="page-subtitle">{employees.length} persona{employees.length !== 1 ? 's' : ''} en el equipo</p>
        </div>
        <Button onClick={() => setModal(true)} className="btn-md">
          <Plus size={16} /> Agregar empleado
        </Button>
      </div>

      {feedback && (
        <Alert
          variant={feedback.type}
          message={feedback.msg}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, cargo o email..."
            className="input-base pl-10 text-sm"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base w-auto text-sm">
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="input-base w-auto text-sm">
          <option value="all">Todas las áreas</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Grid */}
      {employees.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Users size={32} className="text-slate-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">
            {search || statusFilter !== 'all' || deptFilter !== 'all'
              ? 'No hay resultados para esa búsqueda'
              : 'Todavía no hay empleados'}
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            {search || statusFilter !== 'all' || deptFilter !== 'all'
              ? 'Probá con otros filtros.'
              : 'Empezá agregando el primer integrante del equipo.'}
          </p>
          {!search && statusFilter === 'all' && deptFilter === 'all' && (
            <Button onClick={() => setModal(true)} className="btn-md">
              <UserPlus size={15} /> Agregar empleado
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div key={emp._id} className="card p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-3">
                <Avatar name={`${emp.firstName} ${emp.lastName}`} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{emp.firstName} {emp.lastName}</p>
                  <p className="text-sm text-slate-500 truncate">{emp.position}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Badge status={emp.status} />
                    <span className="text-xs text-slate-400 truncate">{emp.department}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg
                             text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                {emp.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={12} className="flex-shrink-0 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                )}
                {emp.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={12} className="flex-shrink-0 text-slate-400" />
                    <span>{emp.phone}</span>
                  </div>
                )}
                {emp.location && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={12} className="flex-shrink-0 text-slate-400" />
                    <span>{emp.location}</span>
                  </div>
                )}
                {emp.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {emp.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{s}</span>
                    ))}
                    {emp.skills.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-xs rounded-full">+{emp.skills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal isOpen={modal} onClose={() => { setModal(false); setForm(EMPTY_FORM); }} title="Agregar empleado" size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nombre *</label>
              <input value={form.firstName} onChange={set('firstName')} required className={inputCls} placeholder="Juan" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Apellido *</label>
              <input value={form.lastName} onChange={set('lastName')} required className={inputCls} placeholder="Pérez" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required className={inputCls} placeholder="juan@empresa.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Cargo *</label>
              <input value={form.position} onChange={set('position')} required className={inputCls} placeholder="Desarrollador Senior" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Área *</label>
              <select value={form.department} onChange={set('department')} className={inputCls}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Teléfono</label>
              <input value={form.phone} onChange={set('phone')} className={inputCls} placeholder="+54 11 1234-5678" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Ubicación</label>
              <input value={form.location} onChange={set('location')} className={inputCls} placeholder="Buenos Aires" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Estado</label>
              <select value={form.status} onChange={set('status')} className={inputCls}>
                <option value="active">Activo</option>
                <option value="vacation">Vacaciones</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Salario mensual ($)</label>
              <input type="number" value={form.salary} onChange={set('salary')} className={inputCls} placeholder="300000" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Habilidades <span className="text-slate-400 font-normal">(separadas por coma)</span>
            </label>
            <input value={form.skills} onChange={set('skills')} className={inputCls} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setModal(false); setForm(EMPTY_FORM); }}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Guardar empleado
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
