'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { PageLoader } from '@/components/ui/Loader';
import { Plus, MapPin, Users, Briefcase, Trash2, Clock } from 'lucide-react';

const DEPARTMENTS = ['Tecnología', 'Diseño', 'Marketing', 'Ventas', 'Finanzas', 'Recursos Humanos', 'Producto', 'Operaciones'];
const EMPTY_FORM = {
  title: '', department: DEPARTMENTS[0], description: '', requirements: '',
  location: 'Buenos Aires, Argentina', type: 'full-time',
  salaryMin: '', salaryMax: '', status: 'open',
};

const TYPE_LABELS = { 'full-time': 'Tiempo completo', 'part-time': 'Medio tiempo', remote: 'Remoto', hybrid: 'Híbrido' };

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const { jobs } = await api.get(`/jobs${params}`);
      setJobs(jobs);
    } catch {
      setFeedback({ type: 'error', msg: 'Error al cargar vacantes.' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        requirements: form.requirements ? form.requirements.split('\n').map((r) => r.trim()).filter(Boolean) : [],
      };
      await api.post('/jobs', payload);
      setFeedback({ type: 'success', msg: 'Vacante creada correctamente.' });
      setModal(false);
      setForm(EMPTY_FORM);
      fetchJobs();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`¿Eliminar la vacante "${title}"?`)) return;
    try {
      await api.delete(`/jobs/${id}`);
      setFeedback({ type: 'success', msg: 'Vacante eliminada.' });
      fetchJobs();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar.' });
    }
  };

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const inputCls = 'input-base text-sm';

  const fmt = (n) => n ? `$${Number(n).toLocaleString('es-AR')}` : null;

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl space-y-5">
      <div className="page-header">
        <div>
          <h2 className="page-title">Vacantes</h2>
          <p className="page-subtitle">{jobs.length} posicion{jobs.length !== 1 ? 'es' : ''} publicada{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setModal(true)} className="btn-md">
          <Plus size={16} /> Nueva vacante
        </Button>
      </div>

      {feedback && <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {[['all', 'Todas'], ['open', 'Abiertas'], ['draft', 'Borradores'], ['closed', 'Cerradas']].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setStatusFilter(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Briefcase size={32} className="text-slate-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">No hay vacantes publicadas</h3>
          <p className="text-sm text-slate-400 mb-4">Creá la primera búsqueda para empezar a recibir candidatos.</p>
          <Button onClick={() => setModal(true)} className="btn-md"><Plus size={15} /> Nueva vacante</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="card p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge status={job.status} />
                    <Badge status={job.type} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">{job.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{job.department}</p>
                </div>
                <button
                  onClick={() => handleDelete(job._id, job.title)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg
                             text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0 mt-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-sm text-slate-600 mt-3 line-clamp-2">{job.description}</p>

              {job.requirements?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.requirements.slice(0, 3).map((r, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">{r}</span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">+{job.requirements.length - 3}</span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" />{job.location}</span>
                <span className="flex items-center gap-1.5"><Users size={12} className="text-slate-400" />{job.applicants} postulante{job.applicants !== 1 ? 's' : ''}</span>
                {(job.salaryMin > 0 || job.salaryMax > 0) && (
                  <span className="text-emerald-600 font-medium">
                    {fmt(job.salaryMin)}{job.salaryMin && job.salaryMax ? ' — ' : ''}{fmt(job.salaryMax)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 ml-auto">
                  <Clock size={12} className="text-slate-400" />
                  {new Date(job.createdAt).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => { setModal(false); setForm(EMPTY_FORM); }} title="Nueva vacante" size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Título del puesto *</label>
            <input value={form.title} onChange={set('title')} required className={inputCls} placeholder="Desarrollador Full Stack Senior" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Área *</label>
              <select value={form.department} onChange={set('department')} className={inputCls}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Modalidad</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Descripción *</label>
            <textarea value={form.description} onChange={set('description')} required rows={3} className={`${inputCls} resize-none`} placeholder="Descripción del puesto..." />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Requisitos <span className="text-slate-400 font-normal">(uno por línea)</span>
            </label>
            <textarea value={form.requirements} onChange={set('requirements')} rows={3} className={`${inputCls} resize-none`} placeholder={"5+ años de experiencia\nReact y Node.js\nInglés intermedio"} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Salario mínimo ($)</label>
              <input type="number" value={form.salaryMin} onChange={set('salaryMin')} className={inputCls} placeholder="300000" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Salario máximo ($)</label>
              <input type="number" value={form.salaryMax} onChange={set('salaryMax')} className={inputCls} placeholder="500000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Ubicación</label>
              <input value={form.location} onChange={set('location')} className={inputCls} placeholder="Buenos Aires, Argentina" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Estado inicial</label>
              <select value={form.status} onChange={set('status')} className={inputCls}>
                <option value="open">Publicar ahora</option>
                <option value="draft">Guardar como borrador</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setModal(false); setForm(EMPTY_FORM); }}>Cancelar</Button>
            <Button type="submit" loading={saving}>Publicar vacante</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
