'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  FileText, CheckCircle, Clock, TrendingUp, Plus, RefreshCw,
  Search, X, ChevronRight, BarChart2, Inbox,
} from 'lucide-react';

const RECOMMENDATION_CONFIG = {
  'Recomendado':  { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'En revisión':  { color: 'bg-amber-100 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  'Descartado':   { color: 'bg-red-100 text-red-700 border-red-200',             dot: 'bg-red-500' },
};

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value ?? '—'}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  );
}

function RecommendationBadge({ recommendation }) {
  const cfg = RECOMMENDATION_CONFIG[recommendation] || RECOMMENDATION_CONFIG['En revisión'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {recommendation}
    </span>
  );
}

function ScoreBar({ score }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-semibold text-slate-700 w-7">{score}</span>
    </div>
  );
}

export default function CvDashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRec, setFilterRec] = useState('Todos');
  const [scoreMin, setScoreMin] = useState('');
  const [scoreMax, setScoreMax] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterRec !== 'Todos') params.set('recommendation', filterRec);
      if (scoreMin) params.set('scoreMin', scoreMin);
      if (scoreMax) params.set('scoreMax', scoreMax);

      const [{ analyses: data }, { total, recommended, inReview, avgScore }] = await Promise.all([
        api.get(`/analyses?${params.toString()}`),
        api.get('/analyses/stats'),
      ]);
      setAnalyses(data);
      setStats({ total, recommended, inReview, avgScore });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterRec, scoreMin, scoreMax]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const clearFilters = () => {
    setSearch('');
    setFilterRec('Todos');
    setScoreMin('');
    setScoreMax('');
  };

  const hasFilters = search || filterRec !== 'Todos' || scoreMin || scoreMax;

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard de Candidatos</h1>
          <p className="text-slate-500 text-sm mt-0.5">Todos los análisis realizados con IA, organizados y listos para revisar.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-secondary btn-md gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
          <Link href="/cv-analysis" className="btn-primary btn-md gap-2">
            <Plus size={16} />
            Nuevo Análisis
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="CVs Analizados"       value={stats?.total}       icon={FileText}   color="text-indigo-600"  bg="bg-indigo-50" />
        <StatCard label="Recomendados"          value={stats?.recommended} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="En Revisión"           value={stats?.inReview}    icon={Clock}       color="text-amber-600"   bg="bg-amber-50" />
        <StatCard label="Score Promedio"        value={stats?.avgScore ? `${stats.avgScore}/100` : '—'} icon={TrendingUp} color="text-violet-600" bg="bg-violet-50" />
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por candidato o puesto..."
              className="input-base pl-9 py-2.5"
            />
          </div>

          {/* Recommendation filter */}
          <select
            value={filterRec}
            onChange={(e) => setFilterRec(e.target.value)}
            className="input-base py-2.5 w-full sm:w-44"
          >
            {['Todos', 'Recomendado', 'En revisión', 'Descartado'].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {/* Score range */}
          <div className="flex items-center gap-2">
            <input
              type="number" min="0" max="100"
              value={scoreMin}
              onChange={(e) => setScoreMin(e.target.value)}
              placeholder="Min"
              className="input-base py-2.5 w-20 text-center"
            />
            <span className="text-slate-400 text-sm">–</span>
            <input
              type="number" min="0" max="100"
              value={scoreMax}
              onChange={(e) => setScoreMax(e.target.value)}
              placeholder="Max"
              className="input-base py-2.5 w-20 text-center"
            />
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="btn-ghost btn-md gap-1.5 whitespace-nowrap">
              <X size={14} /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Cargando análisis...</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Inbox size={24} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              {hasFilters ? 'Sin resultados para estos filtros' : 'Todavía no hay análisis guardados'}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mb-4">
              {hasFilters
                ? 'Probá cambiando los filtros o limpiándolos para ver todos los candidatos.'
                : 'Realizá tu primer análisis de CV con IA y los resultados aparecerán acá.'}
            </p>
            {!hasFilters && (
              <Link href="/cv-analysis" className="btn-primary btn-md gap-2">
                <Plus size={15} /> Realizar primer análisis
              </Link>
            )}
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary btn-md gap-2">
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Candidato</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Puesto</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Score</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Recomendación</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analyses.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(a.candidateName || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 truncate max-w-[150px]">{a.candidateName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 truncate max-w-[180px]">{a.jobTitle || '—'}</td>
                    <td className="px-4 py-3.5"><ScoreBar score={a.score} /></td>
                    <td className="px-4 py-3.5"><RecommendationBadge recommendation={a.recommendation} /></td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setSelected(a)}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Ver detalle <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              {analyses.length} resultado{analyses.length !== 1 ? 's' : ''} encontrado{analyses.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{selected.candidateName}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{selected.jobTitle || 'Puesto no especificado'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Score & Rec */}
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{selected.score}</span>
                    <span className="text-slate-400 text-sm">/100</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Recomendación</p>
                  <RecommendationBadge recommendation={selected.recommendation} />
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Fecha</p>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(selected.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${selected.score >= 70 ? 'bg-emerald-500' : selected.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${selected.score}%` }}
                />
              </div>

              {/* Summary */}
              {selected.summary && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1.5">Resumen del perfil</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{selected.summary}</p>
                </div>
              )}

              {/* Skills */}
              {selected.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map((s, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {selected.strengths?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Coincidencias con el puesto</h4>
                  <ul className="space-y-1">
                    {selected.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gaps */}
              {selected.gaps?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Gaps o puntos a validar</h4>
                  <ul className="space-y-1">
                    {selected.gaps.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <X size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full analysis */}
              {selected.fullAnalysis && (
                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700 flex items-center gap-1.5 select-none">
                    <BarChart2 size={14} />
                    Ver análisis completo
                  </summary>
                  <div className="mt-3 p-4 bg-slate-50 rounded-xl text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-mono max-h-64 overflow-y-auto border border-slate-100">
                    {selected.fullAnalysis}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
