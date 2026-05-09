'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Loader';
import { Users, Briefcase, UserCheck, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABELS = {
  new: 'Nuevo', screening: 'Screening', interview: 'Entrevista',
  offer: 'Oferta', hired: 'Contratado', rejected: 'Rechazado',
};

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-50').replace('-700', '-50')}`}>
          <Icon size={22} className={color} />
        </div>
      </div>
    </div>
  );
}

function PipelineBar({ candidatesByStatus }) {
  const statuses = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];
  const total = candidatesByStatus.reduce((s, c) => s + c.count, 0) || 1;
  const getCount = (s) => candidatesByStatus.find((c) => c._id === s)?.count || 0;

  const colors = {
    new: 'bg-indigo-400', screening: 'bg-purple-400',
    interview: 'bg-amber-400', offer: 'bg-sky-400',
    hired: 'bg-emerald-400', rejected: 'bg-red-400',
  };

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Pipeline de candidatos</h3>
      <div className="flex rounded-full overflow-hidden h-3 mb-5 bg-slate-100">
        {statuses.map((s) => {
          const pct = (getCount(s) / total) * 100;
          return pct > 0 ? (
            <div key={s} className={`${colors[s]} h-full`} style={{ width: `${pct}%` }} title={`${STATUS_LABELS[s]}: ${getCount(s)}`} />
          ) : null;
        })}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {statuses.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors[s]}`} />
            <span className="text-xs text-slate-500">{STATUS_LABELS[s]}</span>
            <span className="text-xs font-semibold text-slate-700 ml-auto">{getCount(s)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) return <PageLoader />;

  const { stats, recentCandidates, recentEmployees, departmentStats, candidatesByStatus } = data || {};

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Aquí tenés un resumen de la actividad de hoy
          </p>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <Clock size={13} />
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total empleados"   value={stats?.totalEmployees}   sub={`${stats?.activeEmployees} activos`}     icon={Users}      color="text-indigo-600" />
        <StatCard label="Vacantes abiertas"  value={stats?.openJobs}          sub={`${stats?.totalCandidates} postulantes`} icon={Briefcase}  color="text-violet-600" />
        <StatCard label="Candidatos nuevos"  value={stats?.newCandidates}     sub={`${stats?.totalCandidates} en total`}    icon={UserCheck}  color="text-amber-600"  />
        <StatCard label="Tasa de retención"  value={`${stats?.retentionRate}%`} sub="empleados activos"                    icon={TrendingUp} color="text-emerald-600" />
      </div>

      {/* Pipeline + Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PipelineBar candidatesByStatus={candidatesByStatus || []} />
        </div>
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Por área</h3>
          <div className="space-y-3">
            {(departmentStats || []).slice(0, 6).map((d) => (
              <div key={d._id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 truncate">{d._id}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${(d.count / (stats?.totalEmployees || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-4 text-right">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent candidates */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Candidatos recientes</h3>
            <Link href="/candidates" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {recentCandidates?.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No hay candidatos todavía</p>
          ) : (
            <div className="space-y-3">
              {(recentCandidates || []).map((c) => (
                <div key={c._id} className="flex items-center gap-3">
                  <Avatar name={`${c.firstName} ${c.lastName}`} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{c.firstName} {c.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{c.jobTitle}</p>
                  </div>
                  <Badge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent employees */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">Empleados recientes</h3>
            <Link href="/employees" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          {recentEmployees?.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No hay empleados todavía</p>
          ) : (
            <div className="space-y-3">
              {(recentEmployees || []).map((e) => (
                <div key={e._id} className="flex items-center gap-3">
                  <Avatar name={`${e.firstName} ${e.lastName}`} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{e.firstName} {e.lastName}</p>
                    <p className="text-xs text-slate-400 truncate">{e.position} · {e.department}</p>
                  </div>
                  <Badge status={e.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
