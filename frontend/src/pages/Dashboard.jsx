import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/Card';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import styles from './Dashboard.module.css';

const STATUS_COLORS = { pending: '#F59E0B', reviewing: '#3B82F6', approved: '#10B981', rejected: '#EF4444', hired: '#8B5CF6' };
const PIE_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

function ScoreBar({ value }) {
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 28 }}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setData(res.data))
      .catch(() => setError('No se pudieron cargar las estadísticas.'))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Cargando dashboard...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.page}>
      <div className={styles.errorState}>{error}</div>
    </div>
  );

  const { summary, positionStats, statusDistribution, recentCVs, recentTests, metrics } = data;

  const pieData = statusDistribution.map(s => ({
    name: { pending: 'Pendiente', reviewing: 'En revisión', approved: 'Aprobado', rejected: 'Rechazado', hired: 'Contratado' }[s._id] || s._id,
    value: s.count
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Aquí está el resumen de tu actividad de reclutamiento"
      />

      <div className={styles.statsGrid}>
        <StatCard icon="📋" label="CVs Totales" value={summary.totalCVs} delta={12} color="primary" subtitle={`${summary.pendingCVs} pendientes`} />
        <StatCard icon="✅" label="Aprobados" value={summary.approvedCVs} delta={8} color="success" subtitle={`${summary.hiredCVs} contratados`} />
        <StatCard icon="🧪" label="Pruebas" value={summary.totalTests} delta={5} color="info" subtitle={`${summary.completedTests} completadas`} />
        <StatCard icon="🎯" label="Tasa conversión" value={`${summary.conversionRate}%`} delta={3} color="warning" subtitle="candidatos → contratados" />
        <StatCard icon="⭐" label="Score promedio" value={summary.avgScore} color="primary" subtitle="de los CVs analizados" />
        <StatCard icon="📌" label="Cargos abiertos" value={positionStats.length} color="info" subtitle="posiciones activas" />
      </div>

      <div className={styles.chartsRow}>
        <Card className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Actividad mensual</h3>
            <span className={styles.cardBadge}>Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={metrics} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="applicants" name="Postulantes" fill="#4F46E5" radius={[4,4,0,0]} />
              <Bar dataKey="hired" name="Contratados" fill="#10B981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className={styles.chartCardSm}>
          <div className={styles.cardHeader}>
            <h3>Estado de CVs</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieLegend}>
            {pieData.map((item, i) => (
              <div key={i} className={styles.pieLegendItem}>
                <span className={styles.pieDot} style={{ background: PIE_COLORS[i] }} />
                <span>{item.name}</span>
                <span className={styles.pieCount}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.chartsRow}>
        <Card className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Tendencia de contrataciones</h3>
            <span className={styles.cardBadge}>2024</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              <Line type="monotone" dataKey="testsCompleted" name="Pruebas" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="openPositions" name="Posiciones" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className={styles.chartCardSm}>
          <div className={styles.cardHeader}>
            <h3>Top posiciones</h3>
          </div>
          <div className={styles.positionList}>
            {positionStats.map((p, i) => (
              <div key={i} className={styles.positionItem}>
                <span className={styles.positionRank}>{i + 1}</span>
                <div className={styles.positionInfo}>
                  <span className={styles.positionName}>{p._id}</span>
                  <div style={{ marginTop: 4 }}>
                    <ScoreBar value={Math.round((p.count / summary.totalCVs) * 100)} />
                  </div>
                </div>
                <span className={styles.positionCount}>{p.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.tablesRow}>
        <Card className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>CVs recientes</h3>
            <a href="/cvs" className={styles.viewAll}>Ver todos →</a>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Posición</th>
                  <th>Estado</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {recentCVs.map(cv => (
                  <tr key={cv._id}>
                    <td><span className={styles.candidateName}>{cv.candidateName}</span></td>
                    <td><span className={styles.position}>{cv.position}</span></td>
                    <td><Badge type={cv.status} /></td>
                    <td><ScoreBar value={cv.score} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Pruebas recientes</h3>
            <a href="/tests" className={styles.viewAll}>Ver todas →</a>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map(t => (
                  <tr key={t._id}>
                    <td><span className={styles.candidateName}>{t.candidateName}</span></td>
                    <td><Badge type={t.testType} /></td>
                    <td><Badge type={t.status} /></td>
                    <td>{t.score !== null ? <ScoreBar value={t.score} /> : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
