'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { PageLoader } from '@/components/ui/Loader';
import { ClipboardList, Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const EMPTY_FORM = { empleado: '', puesto: '', area: '', fechaIngreso: '' };

const scoreBarColor = (p) => {
  if (p >= 75) return 'bg-emerald-500';
  if (p >= 40) return 'bg-amber-500';
  return 'bg-indigo-500';
};

function PlanCard({ plan: initialPlan, onDelete }) {
  const [plan, setPlan] = useState(initialPlan);
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { setPlan(initialPlan); }, [initialPlan]);

  const toggleTask = async (semanaIndex, tareaIndex, completada) => {
    const key = `${semanaIndex}-${tareaIndex}`;
    setUpdating(key);
    try {
      const { plan: updated } = await api.put(`/onboarding/${plan._id}/task`, {
        semanaIndex, tareaIndex, completada,
      });
      setPlan(updated);
    } catch {
      // revert on error
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div
        className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClipboardList size={15} className="text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{plan.empleado}</p>
                <p className="text-xs text-slate-500">{plan.puesto}{plan.area ? ` · ${plan.area}` : ''}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className={`text-lg font-bold ${plan.progreso >= 75 ? 'text-emerald-600' : plan.progreso >= 40 ? 'text-amber-600' : 'text-indigo-600'}`}>
                {plan.progreso}%
              </p>
              <p className="text-xs text-slate-400">completado</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(plan._id, plan.empleado); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={14} />
              </button>
              {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(plan.progreso)}`}
              style={{ width: `${plan.progreso}%` }}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100">
          <div className="p-5 space-y-5">
            {(plan.semanas || []).map((semana, si) => (
              <div key={si}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {semana.numero}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-700">{semana.titulo}</h4>
                </div>
                <ul className="space-y-2 pl-8">
                  {semana.tareas.map((tarea, ti) => {
                    const key = `${si}-${ti}`;
                    const isUpdating = updating === key;
                    return (
                      <li key={ti} className="flex items-start gap-3">
                        <div className="relative flex-shrink-0 mt-0.5">
                          {isUpdating ? (
                            <Loader2 size={16} className="text-violet-500 animate-spin" />
                          ) : (
                            <input
                              type="checkbox"
                              checked={tarea.completada}
                              onChange={(e) => toggleTask(si, ti, e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                            />
                          )}
                        </div>
                        <span className={`text-sm ${tarea.completada ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {tarea.texto}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HrTestsPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState(null);
  const [activeTab] = useState('onboarding');

  const fetchPlans = useCallback(async () => {
    try {
      const { plans } = await api.get('/onboarding');
      setPlans(plans);
    } catch {
      setFeedback({ type: 'error', msg: 'Error al cargar los planes.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.empleado.trim() || !form.puesto.trim()) {
      return setFeedback({ type: 'error', msg: 'El nombre y el puesto son requeridos.' });
    }
    setGenerating(true);
    setFeedback(null);
    try {
      const { plan } = await api.post('/onboarding/generate', form);
      setPlans((prev) => [plan, ...prev]);
      setForm(EMPTY_FORM);
      setFeedback({ type: 'success', msg: `Plan de onboarding de ${plan.empleado} generado con éxito.` });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Error al generar el plan.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el plan de ${nombre}?`)) return;
    try {
      await api.delete(`/onboarding/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      setFeedback({ type: 'success', msg: 'Plan eliminado.' });
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar.' });
    }
  };

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl space-y-5">
      <div className="page-header">
        <div>
          <h2 className="page-title">Pruebas de HR</h2>
          <p className="page-subtitle">Generá planes de onboarding con IA</p>
        </div>
      </div>

      {feedback && <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />}

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white shadow-sm">
          Onboarding
        </button>
        <button disabled className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed flex items-center gap-1.5">
          <Plus size={14} /> Próximamente
        </button>
      </div>

      {/* New plan form */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Nuevo plan de onboarding</h3>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nombre del empleado *</label>
              <input
                value={form.empleado}
                onChange={set('empleado')}
                placeholder="Ej: María García"
                className="input-base text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Puesto *</label>
              <input
                value={form.puesto}
                onChange={set('puesto')}
                placeholder="Ej: Desarrollador Frontend"
                className="input-base text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Área</label>
              <input
                value={form.area}
                onChange={set('area')}
                placeholder="Ej: Tecnología"
                className="input-base text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Fecha de ingreso</label>
              <input
                type="date"
                value={form.fechaIngreso}
                onChange={set('fechaIngreso')}
                className="input-base text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={generating} className="btn-md">
              {generating ? 'Generando plan...' : 'Generar Plan con IA'}
            </Button>
          </div>
        </form>
      </div>

      {/* Plans list */}
      {plans.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-3">
            <ClipboardList size={28} className="text-violet-300" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Sin planes todavía</h3>
          <p className="text-sm text-slate-400">Completá el formulario y generá el primer plan de onboarding.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {plans.length} plan{plans.length !== 1 ? 'es' : ''} generado{plans.length !== 1 ? 's' : ''}
          </p>
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
