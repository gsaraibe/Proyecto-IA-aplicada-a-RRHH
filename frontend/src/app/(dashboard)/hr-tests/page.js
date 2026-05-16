'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Sparkles, RotateCcw, Save, CheckCircle, AlertCircle,
  Plus, Calendar, ChevronDown, ClipboardList, Users,
} from 'lucide-react';

const DEFAULT_ONBOARDING_PROMPT = `Actúa como un/a especialista senior en Recursos Humanos con experiencia en onboarding corporativo, experiencia del colaborador y gestión del talento.

OBJETIVO:
Diseñar un plan de onboarding estructurado, profesional y adaptable que facilite la integración del nuevo colaborador, acelere su adaptación al puesto y mejore su experiencia de ingreso a la organización.

PRINCIPIOS:
- Basar el onboarding en buenas prácticas de RRHH.
- Mantener enfoque práctico y aplicable.
- Adaptar el contenido al rol, área y seniority.
- No inventar políticas internas no proporcionadas.
- Si falta información organizacional, utilizar buenas prácticas generales e indicar los supuestos utilizados.
- Evitar tareas genéricas o poco relevantes.
- Diseñar el plan con enfoque en experiencia del colaborador y productividad temprana.

CONFIDENCIALIDAD Y ÉTICA:
- Mantener enfoque profesional y corporativo.
- Evitar sesgos o lenguaje discriminatorio.

HUMAN-IN-THE-LOOP:
- Este plan es una propuesta de apoyo a RRHH y líderes. La implementación final puede ajustarse según criterios organizacionales.

INSTRUCCIONES:
1. Generar un plan de onboarding de 30 días dividido en 4 semanas.
2. Para cada semana incluir: título de la etapa, objetivo de la semana, entre 4 y 6 tareas concretas y realizables, responsables involucrados, resultado esperado.
3. Adaptar todas las tareas específicamente al puesto, área y seniority.
4. Las tareas deben incluir: integración al equipo, capacitación inicial, herramientas y accesos, conocimiento de procesos, cultura organizacional, seguimiento y feedback, reuniones clave, objetivos iniciales.
5. Evitar: tareas genéricas, actividades repetidas, acciones poco aplicables al día a día.
6. Si corresponde, incluir: mentor o referente, capacitaciones obligatorias, compliance, seguridad de la información, políticas internas.

OUTPUT:
A. Resumen ejecutivo del onboarding
B. Cronograma semanal estructurado (Semana, Objetivo, Tareas, Responsable, Resultado esperado)
C. Checklist operativo inicial (accesos, documentación, herramientas, reuniones)
D. Recomendaciones finales (buenas prácticas, riesgos comunes, sugerencias de seguimiento)
E. KPIs sugeridos (tiempo de adaptación, satisfacción, cumplimiento de capacitación, nivel de integración inicial)

FORMATO: profesional, corporativo, claro y accionable, fácil de implementar, con tablas cuando sea útil.`;

function ProgressBar({ weeks }) {
  const allTasks = weeks.flatMap((w) => w.tasks || []);
  const done = allTasks.filter((t) => t.completed).length;
  const total = allTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">Progreso del plan</span>
        <span className="text-sm font-bold text-indigo-600">{done}/{total} tareas completadas</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5">{pct}% completado</p>
    </div>
  );
}

function WeekCard({ week, planId, onTaskToggle }) {
  const [open, setOpen] = useState(true);
  const done = (week.tasks || []).filter((t) => t.completed).length;
  const total = (week.tasks || []).length;

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-slate-50/80 hover:bg-slate-100/60 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{week.number}</span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-800">{week.title}</p>
          {week.objective && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{week.objective}</p>}
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap mr-2">{done}/{total}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="p-5 space-y-3">
          {week.objective && (
            <p className="text-xs text-slate-500 italic border-l-2 border-indigo-200 pl-3">{week.objective}</p>
          )}
          <ul className="space-y-2">
            {(week.tasks || []).map((task) => (
              <li
                key={task._id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group
                  ${task.completed
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30'
                  }`}
                onClick={() => onTaskToggle(planId, task._id, !task.completed)}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                  ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                  {task.completed && <CheckCircle size={12} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.text}
                  </p>
                  {task.responsible && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Users size={10} /> {task.responsible}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {week.expectedResult && (
            <div className="flex items-start gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100 text-xs text-indigo-700">
              <ClipboardList size={12} className="flex-shrink-0 mt-0.5" />
              <span><strong>Resultado esperado:</strong> {week.expectedResult}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HrTestsPage() {
  const [activeTab, setActiveTab] = useState('onboarding');

  // Form state
  const [form, setForm] = useState({ employeeName: '', position: '', department: '', startDate: '' });
  const [prompt, setPrompt] = useState(DEFAULT_ONBOARDING_PROMPT);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null); // { weeks, fullPlan }
  const [error, setError] = useState('');

  // Saved plans
  const [savedPlans, setSavedPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveDone, setSaveDone] = useState(false);

  useEffect(() => {
    api.get('/onboarding').then(({ plans }) => setSavedPlans(plans)).catch(() => {});
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.employeeName || !form.position || !form.department) {
      setError('Completá al menos el nombre, puesto y área.');
      return;
    }
    setError('');
    setGenerating(true);
    setGeneratedPlan(null);
    setActivePlan(null);
    setSaveDone(false);

    try {
      const { weeks, fullPlan } = await api.post('/ai/generate-onboarding', { ...form, prompt });
      setGeneratedPlan({ weeks, fullPlan });
    } catch (err) {
      setError(err.message || 'Error al generar. Verificá la API Key en Configuración.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    try {
      const { plan } = await api.post('/onboarding', {
        ...form,
        weeks: generatedPlan.weeks,
        fullPlan: generatedPlan.fullPlan,
      });
      setActivePlan(plan);
      setSavedPlans((prev) => [plan, ...prev]);
      setSaveDone(true);
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTaskToggle = async (planId, taskId, completed) => {
    try {
      const { plan } = await api.patch(`/onboarding/${planId}/tasks/${taskId}`, { completed });
      setActivePlan(plan);
      setSavedPlans((prev) => prev.map((p) => p._id === planId ? plan : p));
    } catch { /* silent fail */ }
  };

  const handleLoadPlan = (plan) => {
    setActivePlan(plan);
    setGeneratedPlan(null);
    setForm({
      employeeName: plan.employeeName,
      position: plan.position,
      department: plan.department,
      startDate: plan.startDate ? plan.startDate.split('T')[0] : '',
    });
    setSaveDone(true);
  };

  const handleReset = () => {
    setForm({ employeeName: '', position: '', department: '', startDate: '' });
    setPrompt(DEFAULT_ONBOARDING_PROMPT);
    setGeneratedPlan(null);
    setActivePlan(null);
    setError('');
    setSaveDone(false);
  };

  const displayWeeks = activePlan?.weeks || generatedPlan?.weeks || [];
  const displayPlanId = activePlan?._id;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Herramientas HR</h1>
        <p className="text-slate-500 text-sm mt-0.5">Generá planes y herramientas de RRHH asistidas por IA.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'onboarding'
              ? 'bg-white shadow-sm text-slate-800'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Onboarding
        </button>
        <div className="relative group">
          <button
            disabled
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 cursor-not-allowed flex items-center gap-1.5"
          >
            <Plus size={14} /> Próximamente
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Más herramientas próximamente
          </div>
        </div>
      </div>

      {/* Saved plans */}
      {savedPlans.length > 0 && !activePlan && !generatedPlan && (
        <div className="card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Planes guardados</h3>
          <div className="space-y-2">
            {savedPlans.slice(0, 5).map((plan) => (
              <button
                key={plan._id}
                onClick={() => handleLoadPlan(plan)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ClipboardList size={15} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{plan.employeeName}</p>
                  <p className="text-xs text-slate-400 truncate">{plan.position} · {plan.department}</p>
                </div>
                <span className="text-xs text-slate-300">
                  {new Date(plan.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding form */}
      {activeTab === 'onboarding' && (
        <form onSubmit={handleGenerate} className="card p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-800">Plan de Onboarding — Nuevo colaborador</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Nombre del empleado</label>
              <input
                type="text"
                value={form.employeeName}
                onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                placeholder="Ej: María González"
                required
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Puesto</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Ej: Desarrolladora Frontend Senior"
                required
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Área / Departamento</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="Ej: Tecnología"
                required
                className="input-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                <span className="flex items-center gap-1.5"><Calendar size={13} /> Fecha de ingreso</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-base"
              />
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500" />
              ¿Qué querés que genere la IA?
            </label>
            <p className="text-xs text-slate-400">Podés editar este prompt para personalizar el plan generado.</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-base min-h-[160px] resize-y text-xs font-mono leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={generating}
              className="btn-primary btn-lg gap-2 flex-1"
            >
              {generating ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando plan con IA...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generar Plan con IA
                </>
              )}
            </button>
            {(generatedPlan || activePlan) && (
              <button type="button" onClick={handleReset} className="btn-secondary btn-lg gap-2">
                <RotateCcw size={16} /> Nuevo plan
              </button>
            )}
          </div>
        </form>
      )}

      {/* Plan results */}
      {displayWeeks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Plan de 30 días — {form.employeeName}
              </h2>
              <p className="text-sm text-slate-400">{form.position} · {form.department}</p>
            </div>
            {!saveDone && generatedPlan && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary btn-md gap-2"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? 'Guardando...' : 'Guardar plan'}
              </button>
            )}
            {saveDone && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <CheckCircle size={15} /> Plan guardado
              </span>
            )}
          </div>

          <ProgressBar weeks={displayWeeks} />

          <div className="space-y-3">
            {displayWeeks.map((week, i) => (
              <WeekCard
                key={i}
                week={week}
                planId={displayPlanId}
                onTaskToggle={displayPlanId ? handleTaskToggle : () => {}}
              />
            ))}
          </div>

          {!saveDone && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              <AlertCircle size={15} className="flex-shrink-0" />
              Este plan no está guardado todavía. Hacé clic en &quot;Guardar plan&quot; para conservar el estado de los checkboxes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
