'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PageLoader } from '@/components/ui/Loader';
import Avatar from '@/components/ui/Avatar';
import Alert from '@/components/ui/Alert';
import {
  FileText, UserCheck, UserX, Star, Plus, Filter,
  ChevronDown, Brain, Clock, SearchX,
} from 'lucide-react';

const ESTADOS = [
  { value: 'todos', label: 'Todos' },
  { value: 'recomendado', label: 'Recomendado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'descartado', label: 'Descartado' },
];

const estadoBadge = (estado) => {
  switch (estado) {
    case 'recomendado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'descartado':  return 'bg-red-100 text-red-700 border-red-200';
    default:            return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const estadoLabel = (estado) => {
  switch (estado) {
    case 'recomendado': return 'Recomendado';
    case 'descartado':  return 'Descartado';
    default:            return 'Pendiente';
  }
};

const scoreColor = (s) => {
  if (s >= 80) return 'text-emerald-600';
  if (s >= 60) return 'text-amber-600';
  return 'text-red-500';
};

const scoreBg = (s) => {
  if (s >= 80) return 'bg-emerald-50 border-emerald-200';
  if (s >= 60) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
};

function MetricCard({ icon: Icon, label, value, sub, iconBg, iconColor, loading }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        {loading ? (
          <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-3xl font-bold text-slate-800 mt-0.5">{value}</p>
        )}
        {sub && !loading && (
          <p className="text-xs text-slate-400 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default function CandidateDashboardPage() {
  const router = useRouter();

  const [analisis, setAnalisis] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [puestoFilter, setPuestoFilter] = useState('');
  const [puestoInput, setPuestoInput] = useState('');

  // Puestos únicos para el select
  const puestosUnicos = [...new Set(analisis.map((a) => a.puesto))].sort();

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api.get('/cv-analisis/stats');
      setStats(data);
    } catch {
      // stats no críticas
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchAnalisis = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (estadoFilter !== 'todos') params.set('estado', estadoFilter);
      if (puestoFilter) params.set('puesto', puestoFilter);
      const data = await api.get(`/cv-analisis?${params}`);
      setAnalisis(data.analisis ?? []);
    } catch {
      setError('No se pudieron cargar los candidatos. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [estadoFilter, puestoFilter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchAnalisis(); }, [fetchAnalisis]);

  const hayFiltros = estadoFilter !== 'todos' || puestoFilter !== '';

  const limpiarFiltros = () => {
    setEstadoFilter('todos');
    setPuestoFilter('');
    setPuestoInput('');
  };

  if (loading && !analisis.length) return <PageLoader />;

  return (
    <div className="max-w-7xl space-y-6">

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard de Candidatos</h2>
          <p className="page-subtitle">Análisis de CVs realizados por IA · datos en tiempo real</p>
        </div>
        <button
          onClick={() => router.push('/cv-analysis')}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus size={16} />
          Nuevo Análisis
        </button>
      </div>

      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={FileText}
          label="CVs Analizados"
          value={stats?.total ?? 0}
          sub="Total acumulado"
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          loading={statsLoading}
        />
        <MetricCard
          icon={UserCheck}
          label="Recomendados"
          value={stats?.recomendados ?? 0}
          sub={stats ? `${stats.total ? Math.round((stats.recomendados / stats.total) * 100) : 0}% del total` : ''}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          loading={statsLoading}
        />
        <MetricCard
          icon={UserX}
          label="Descartados"
          value={stats?.descartados ?? 0}
          sub={stats ? `${stats.total ? Math.round((stats.descartados / stats.total) * 100) : 0}% del total` : ''}
          iconBg="bg-red-50"
          iconColor="text-red-500"
          loading={statsLoading}
        />
        <MetricCard
          icon={Star}
          label="Score Promedio"
          value={stats ? `${stats.scorePromedio}` : '0'}
          sub="sobre 100 puntos"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          loading={statsLoading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter size={15} />
          <span className="font-medium">Filtrar:</span>
        </div>

        {/* Estado filter */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
          {ESTADOS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setEstadoFilter(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                estadoFilter === value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Puesto filter */}
        <div className="relative">
          <select
            value={puestoFilter}
            onChange={(e) => setPuestoFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Todos los puestos</option>
            {puestosUnicos.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2"
          >
            Limpiar filtros
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400">
          {analisis.length} resultado{analisis.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table or empty state */}
      {analisis.length === 0 ? (
        <div className="card flex flex-col items-center py-20 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5">
            {hayFiltros
              ? <SearchX size={36} className="text-indigo-300" />
              : <Brain size={36} className="text-indigo-300" />
            }
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-2">
            {hayFiltros ? 'Sin resultados para estos filtros' : 'Todavía no hay análisis de CVs'}
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            {hayFiltros
              ? 'Probá con otro estado o puesto, o limpiá los filtros para ver todos los candidatos.'
              : 'Usá el botón "Nuevo Análisis" para cargar y analizar el primer CV con IA.'}
          </p>
          {hayFiltros ? (
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              Limpiar filtros
            </button>
          ) : (
            <button
              onClick={() => router.push('/cv-analysis')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <Plus size={16} />
              Nuevo Análisis
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Candidato</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Puesto aplicado</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score IA</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-left hidden xl:table-cell">Resumen IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analisis.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={a.nombre} size="sm" />
                        <p className="font-medium text-slate-800">{a.nombre}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-700 max-w-[200px] truncate">{a.puesto}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${scoreBg(a.score)}`}>
                        <Star size={11} className={scoreColor(a.score)} fill="currentColor" />
                        <span className={scoreColor(a.score)}>{a.score}<span className="font-normal text-slate-400">/100</span></span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${estadoBadge(a.estado)}`}>
                        {estadoLabel(a.estado)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} className="text-slate-400" />
                        <span>{new Date(a.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <p className="text-slate-500 text-xs max-w-xs line-clamp-2">{a.resumenIA || '—'}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
