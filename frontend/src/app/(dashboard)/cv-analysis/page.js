'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Alert from '@/components/ui/Alert';
import { Brain, Upload, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

const PUESTOS_SUGERIDOS = [
  'Desarrollador Full Stack Senior',
  'Desarrollador Full Stack Junior',
  'Diseñador UX/UI',
  'Gerente de Marketing Digital',
  'Analista de Datos',
  'DevOps Engineer',
  'Product Manager',
  'Analista de RRHH',
];

const ESTADO_DEFAULT = 'pendiente';

const generarResumenIA = (nombre, puesto, score) => {
  if (score >= 85) {
    return `Candidato/a ${nombre} presenta un perfil altamente calificado para el puesto de ${puesto}. El análisis del CV refleja experiencia relevante y habilidades técnicas alineadas con los requerimientos. Se recomienda avanzar inmediatamente al proceso de entrevistas.`;
  }
  if (score >= 65) {
    return `El perfil de ${nombre} muestra competencias adecuadas para el rol de ${puesto}. Existen áreas de fortaleza claras, aunque también algunas brechas menores. Se recomienda una evaluación adicional antes de tomar una decisión.`;
  }
  return `El CV de ${nombre} no cumple con los criterios mínimos para la posición de ${puesto}. Las habilidades declaradas no se corresponden con los requerimientos del puesto. No se recomienda continuar el proceso de selección.`;
};

export default function CVAnalysisPage() {
  const router = useRouter();

  const [form, setForm] = useState({ nombre: '', puesto: '' });
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.puesto.trim()) return;

    setAnalyzing(true);
    setFeedback(null);

    // Simula procesamiento IA (1.5s)
    await new Promise((r) => setTimeout(r, 1500));

    const score = Math.floor(Math.random() * 60) + 35; // 35-94
    const estado = score >= 75 ? 'recomendado' : score >= 55 ? 'pendiente' : 'descartado';
    const resumenIA = generarResumenIA(form.nombre, form.puesto, score);

    try {
      await api.post('/cv-analisis', {
        nombre: form.nombre.trim(),
        puesto: form.puesto.trim(),
        score,
        estado,
        resumenIA,
        fecha: new Date().toISOString(),
      });
      setDone(true);
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Error al guardar el análisis. Intentá de nuevo.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 placeholder:text-slate-400';

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/candidate-dashboard')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="page-title">Análisis de CV</h2>
          <p className="page-subtitle">La IA evalúa el perfil y genera un score y resumen automático</p>
        </div>
      </div>

      {feedback && <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />}

      {done ? (
        // Success state
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-5">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Análisis completado</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-8">
            El CV fue procesado por la IA y el candidato ya aparece en el dashboard.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setDone(false); setForm({ nombre: '', puesto: '' }); }}
              className="px-4 py-2.5 text-sm font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Analizar otro CV
            </button>
            <button
              onClick={() => router.push('/candidate-dashboard')}
              className="px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Ver Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="card space-y-6">
          {/* Upload placeholder */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-default">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3">
              <Upload size={24} className="text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Subir archivo de CV</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC o DOCX · máximo 5 MB</p>
            <p className="text-xs text-indigo-500 mt-3 font-medium">Integración de carga de archivos próximamente</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">o completá los datos manualmente</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre completo del candidato <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nombre}
                onChange={set('nombre')}
                required
                placeholder="Ej: María González"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Puesto al que aplica <span className="text-red-500">*</span>
              </label>
              <input
                list="puestos-list"
                value={form.puesto}
                onChange={set('puesto')}
                required
                placeholder="Ej: Desarrollador Full Stack Senior"
                className={inputCls}
              />
              <datalist id="puestos-list">
                {PUESTOS_SUGERIDOS.map((p) => <option key={p} value={p} />)}
              </datalist>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 flex gap-3">
              <Brain size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-indigo-800">Análisis automático por IA</p>
                <p className="text-xs text-indigo-600 mt-0.5">
                  La IA evaluará el perfil, asignará un score del 1 al 100 y generará un resumen detallado de manera automática.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing || !form.nombre.trim() || !form.puesto.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              {analyzing ? (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  Analizando con IA…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Analizar CV con IA
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
