'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { PageLoader } from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import { BrainCircuit, Plus, Trash2, ChevronRight, Star, CheckCircle2, Clock, XCircle } from 'lucide-react';

const scoreColor = (s) => {
  if (s >= 75) return 'text-emerald-600';
  if (s >= 50) return 'text-amber-600';
  return 'text-red-500';
};

const scoreBarColor = (s) => {
  if (s >= 75) return 'bg-emerald-500';
  if (s >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

export default function HrIntelligencePage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchAnalyses = useCallback(async () => {
    try {
      const { analyses } = await api.get('/hr-intelligence');
      setAnalyses(analyses);
    } catch {
      setFeedback({ type: 'error', msg: 'Error al cargar los análisis.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el análisis de ${nombre}?`)) return;
    try {
      await api.delete(`/hr-intelligence/${id}`);
      setFeedback({ type: 'success', msg: 'Análisis eliminado.' });
      fetchAnalyses();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar.' });
    }
  };

  const recomendados = analyses.filter((a) => a.recomendacion === 'Recomendado').length;
  const enRevision = analyses.filter((a) => a.recomendacion === 'En revisión').length;
  const scorePromedio = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
    : 0;

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl space-y-5">
      <div className="page-header">
        <div>
          <h2 className="page-title">Análisis de CVs</h2>
          <p className="page-subtitle">{analyses.length} análisis guardados</p>
        </div>
        <Link href="/hr-intelligence/analysis">
          <Button className="btn-md">
            <Plus size={16} /> Nuevo análisis
          </Button>
        </Link>
      </div>

      {feedback && <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CVs Analizados</p>
          <p className="text-3xl font-bold text-slate-800">{analyses.length}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recomendados</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{recomendados}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-amber-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">En Revisión</p>
          </div>
          <p className="text-3xl font-bold text-amber-600">{enRevision}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-indigo-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score Promedio</p>
          </div>
          <p className={`text-3xl font-bold ${scoreColor(scorePromedio)}`}>{scorePromedio}</p>
        </div>
      </div>

      {analyses.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
            <BrainCircuit size={32} className="text-violet-300" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">No hay análisis guardados</h3>
          <p className="text-sm text-slate-400 mb-4">Analizá un CV con IA para ver los resultados aquí.</p>
          <Link href="/hr-intelligence/analysis">
            <Button className="btn-md"><Plus size={15} /> Nuevo análisis</Button>
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidato</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Skills</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Recomendación</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyses.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{a.nombre}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">{a.resumen}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(a.skills || []).slice(0, 3).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">{s}</span>
                        ))}
                        {(a.skills || []).length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">+{a.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${scoreBarColor(a.score)}`} style={{ width: `${a.score}%` }} />
                        </div>
                        <span className={`font-semibold text-sm ${scoreColor(a.score)}`}>{a.score}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={a.recomendacion} />
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(a.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDetail(a)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="Ver detalle"
                        >
                          <ChevronRight size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id, a.nombre)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail?.nombre || ''} size="md">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge status={detail.recomendacion} />
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBarColor(detail.score)}`} style={{ width: `${detail.score}%` }} />
                </div>
                <span className={`font-bold ${scoreColor(detail.score)}`}>{detail.score}/100</span>
              </div>
            </div>
            <p className="text-sm text-slate-600">{detail.resumen}</p>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {(detail.skills || []).map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Coincidencias</p>
                <ul className="space-y-1">
                  {(detail.coincidencias || []).map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Gaps</p>
                <ul className="space-y-1">
                  {(detail.gaps || []).map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                      <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
