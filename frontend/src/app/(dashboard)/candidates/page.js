'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { PageLoader } from '@/components/ui/Loader';
import { Plus, Search, Mail, Star, Trash2, UserCheck } from 'lucide-react';

const STATUSES = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Entrevista' },
  { value: 'offer', label: 'Oferta' },
  { value: 'hired', label: 'Contratados' },
  { value: 'rejected', label: 'Rechazados' },
];

const SOURCES = ['linkedin', 'referido', 'web', 'portal', 'otro'];
const SOURCE_LABELS = { linkedin: 'LinkedIn', referido: 'Referido/a', web: 'Sitio web', portal: 'Portal de empleo', otro: 'Otro' };

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  jobTitle: '', status: 'new', score: 0, experience: 0,
  skills: '', source: 'web', notes: '',
};

const scoreColor = (s) => {
  if (s >= 80) return 'text-emerald-600';
  if (s >= 60) return 'text-amber-600';
  return 'text-red-500';
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchCandidates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const { candidates } = await api.get(`/candidates?${params}`);
      setCandidates(candidates);
    } catch {
      setFeedback({ type: 'error', msg: 'Error al cargar candidatos.' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        score: Number(form.score),
        experience: Number(form.experience),
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      await api.post('/candidates', payload);
      setFeedback({ type: 'success', msg: 'Candidato agregado.' });
      setModal(false);
      setForm(EMPTY_FORM);
      fetchCandidates();
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/candidates/${id}`, { status });
      fetchCandidates();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al actualizar estado.' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar candidato ${name}?`)) return;
    try {
      await api.delete(`/candidates/${id}`);
      setFeedback({ type: 'success', msg: 'Candidato eliminado.' });
      fetchCandidates();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar.' });
    }
  };

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const inputCls = 'input-base text-sm';

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl space-y-5">
      <div className="page-header">
        <div>
          <h2 className="page-title">Candidatos</h2>
          <p className="page-subtitle">{candidates.length} candidato{candidates.length !== 1 ? 's' : ''} en el pipeline</p>
        </div>
        <Button onClick={() => setModal(true)} className="btn-md">
          <Plus size={16} /> Agregar candidato
        </Button>
      </div>

      {feedback && <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." className="input-base pl-10 text-sm" />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {STATUSES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === value ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <UserCheck size={32} className="text-slate-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">No hay candidatos</h3>
          <p className="text-sm text-slate-400 mb-4">
            {search || statusFilter !== 'all' ? 'Probá con otros filtros.' : 'Agregá el primer candidato al pipeline.'}
          </p>
          {!search && statusFilter === 'all' && (
            <Button onClick={() => setModal(true)} className="btn-md"><Plus size={15} /> Agregar candidato</Button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidato</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Puesto</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fuente</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${c.firstName} ${c.lastName}`} size="sm" />
                        <div>
                          <p className="font-medium text-slate-800">{c.firstName} {c.lastName}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <Mail size={11} />
                            <span>{c.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-700 max-w-[200px] truncate">{c.jobTitle || '—'}</p>
                      {c.experience > 0 && <p className="text-xs text-slate-400 mt-0.5">{c.experience} año{c.experience !== 1 ? 's' : ''} de exp.</p>}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        {STATUSES.filter((s) => s.value !== 'all').map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      {c.score > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <Star size={13} className={scoreColor(c.score)} fill="currentColor" />
                          <span className={`font-semibold ${scoreColor(c.score)}`}>{c.score}</span>
                        </div>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-600">{SOURCE_LABELS[c.source] || c.source}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(c._id, `${c.firstName} ${c.lastName}`)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => { setModal(false); setForm(EMPTY_FORM); }} title="Agregar candidato" size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nombre *</label>
              <input value={form.firstName} onChange={set('firstName')} required className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Apellido *</label>
              <input value={form.lastName} onChange={set('lastName')} required className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Teléfono</label>
              <input value={form.phone} onChange={set('phone')} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Puesto al que aplica</label>
              <input value={form.jobTitle} onChange={set('jobTitle')} className={inputCls} placeholder="Desarrollador Senior" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Estado</label>
              <select value={form.status} onChange={set('status')} className={inputCls}>
                {STATUSES.filter((s) => s.value !== 'all').map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Fuente</label>
              <select value={form.source} onChange={set('source')} className={inputCls}>
                {SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Score (0-100)</label>
              <input type="number" min="0" max="100" value={form.score} onChange={set('score')} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Años de experiencia</label>
              <input type="number" min="0" value={form.experience} onChange={set('experience')} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Habilidades (separadas por coma)</label>
            <input value={form.skills} onChange={set('skills')} className={inputCls} placeholder="React, TypeScript, Node.js" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Notas</label>
            <textarea value={form.notes} onChange={set('notes')} rows={2} className={`${inputCls} resize-none`} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setModal(false); setForm(EMPTY_FORM); }}>Cancelar</Button>
            <Button type="submit" loading={saving}>Guardar candidato</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
