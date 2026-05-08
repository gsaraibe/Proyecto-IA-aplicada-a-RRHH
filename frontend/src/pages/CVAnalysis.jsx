import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { CVCardSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import styles from './CVAnalysis.module.css';

const STATUS_OPTIONS = ['', 'pending', 'reviewing', 'approved', 'rejected', 'hired'];
const STATUS_LABELS = { '': 'Todos', pending: 'Pendiente', reviewing: 'En revisión', approved: 'Aprobado', rejected: 'Rechazado', hired: 'Contratado' };

function ScoreCircle({ value }) {
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444';
  const r = 18, c = 2 * Math.PI * r;
  const pct = (value / 100) * c;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#F3F4F6" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${pct} ${c}`} strokeLinecap="round" transform="rotate(-90 24 24)" />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{value}</text>
    </svg>
  );
}

const STATUS_LABELS_SHORT = { reviewing: 'En revisión', approved: 'Aprobado', rejected: 'Rechazado', hired: 'Contratado' };

function CVDrawer({ cv, onClose, onStatusChange }) {
  const [status, setStatus] = useState(cv.status);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleStatus = async (newStatus) => {
    setSaving(true);
    try {
      await api.put(`/cvs/${cv._id}/status`, { status: newStatus });
      setStatus(newStatus);
      onStatusChange(cv._id, newStatus);
      toast.success(`Estado actualizado a "${STATUS_LABELS_SHORT[newStatus]}".`);
    } catch {
      toast.error('No se pudo actualizar el estado. Intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div>
            <h2>{cv.candidateName}</h2>
            <p>{cv.position} · {cv.experience} años exp.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.drawerSection}>
            <div className={styles.scoreRow}>
              <ScoreCircle value={cv.score} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Score IA</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Fit: {cv.aiAnalysis?.fitScore}%</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Badge type={status} />
              </div>
            </div>
          </div>

          <div className={styles.drawerSection}>
            <h4>Información de contacto</h4>
            <div className={styles.infoGrid}>
              <span>📧 {cv.email}</span>
              {cv.phone && <span>📱 {cv.phone}</span>}
              <span>🎓 {cv.education}</span>
              <span>💼 {cv.experience} años de experiencia</span>
            </div>
          </div>

          <div className={styles.drawerSection}>
            <h4>Habilidades</h4>
            <div className={styles.skills}>
              {cv.skills?.map(s => <span key={s} className={styles.skill}>{s}</span>)}
            </div>
          </div>

          <div className={styles.drawerSection}>
            <h4>Resumen</h4>
            <p className={styles.summary}>{cv.summary}</p>
          </div>

          {cv.aiAnalysis?.recommendation && (
            <div className={styles.drawerSection}>
              <h4>Análisis de IA</h4>
              <div className={styles.aiBox}>
                <p className={styles.aiRec}>💡 {cv.aiAnalysis.recommendation}</p>
                {cv.aiAnalysis.strengths?.length > 0 && (
                  <div className={styles.aiLists}>
                    <div>
                      <div className={styles.aiListTitle} style={{ color: '#10B981' }}>✓ Fortalezas</div>
                      {cv.aiAnalysis.strengths.map(s => <div key={s} className={styles.aiListItem}>• {s}</div>)}
                    </div>
                    {cv.aiAnalysis.weaknesses?.length > 0 && (
                      <div>
                        <div className={styles.aiListTitle} style={{ color: '#EF4444' }}>✗ Áreas de mejora</div>
                        {cv.aiAnalysis.weaknesses.map(w => <div key={w} className={styles.aiListItem}>• {w}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.drawerSection}>
            <h4>Cambiar estado</h4>
            <div className={styles.statusBtns}>
              {['reviewing', 'approved', 'rejected', 'hired'].map(s => (
                <button
                  key={s}
                  className={`${styles.statusBtn} ${status === s ? styles.active : ''}`}
                  onClick={() => handleStatus(s)}
                  disabled={saving || status === s}
                >
                  <Badge type={s} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CVAnalysis() {
  const [cvs, setCvs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const fetchCVs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await api.get(`/cvs?${params}`);
      setCvs(res.data.cvs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      toast.error('No se pudieron cargar los CVs. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const handleStatusChange = (id, newStatus) => {
    setCvs(prev => prev.map(cv => cv._id === id ? { ...cv, status: newStatus } : cv));
    if (selected?._id === id) setSelected(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Análisis de CVs"
        subtitle={`${total} candidatos en total`}
      />

      <Card className={styles.filterCard}>
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar por nombre, email o posición..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.statusFilters}>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${statusFilter === s ? styles.active : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => <CVCardSkeleton key={i} />)}
        </div>
      ) : cvs.length === 0 ? (
        <Card>
          <EmptyState
            preset={search || statusFilter ? 'search' : 'cvs'}
            action={search || statusFilter ? () => { setSearch(''); setStatusFilter(''); } : undefined}
            actionLabel={search || statusFilter ? 'Limpiar filtros' : undefined}
          />
        </Card>
      ) : (
        <>
          <div className={styles.grid}>
            {cvs.map(cv => (
              <Card key={cv._id} className={styles.cvCard} style={{ cursor: 'pointer' }}>
                <div className={styles.cvCardInner} onClick={() => setSelected(cv)}>
                  <div className={styles.cvCardTop}>
                    <div className={styles.initials}>
                      {cv.candidateName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className={styles.cvInfo}>
                      <h4>{cv.candidateName}</h4>
                      <span>{cv.position}</span>
                    </div>
                    <ScoreCircle value={cv.score} />
                  </div>
                  <div className={styles.cvMeta}>
                    <span>💼 {cv.experience} años</span>
                    <span>🎓 {cv.education?.slice(0, 20)}{cv.education?.length > 20 ? '...' : ''}</span>
                  </div>
                  <div className={styles.cvSkills}>
                    {cv.skills?.slice(0, 3).map(s => <span key={s} className={styles.skillTag}>{s}</span>)}
                    {cv.skills?.length > 3 && <span className={styles.skillMore}>+{cv.skills.length - 3}</span>}
                  </div>
                  <div className={styles.cvFooter}>
                    <Badge type={cv.status} />
                    <span className={styles.cvDate}>{new Date(cv.createdAt).toLocaleDateString('es-AR')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {pages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Anterior</button>
              <span className={styles.pageInfo}>{page} / {pages}</span>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Siguiente →</button>
            </div>
          )}
        </>
      )}

      {selected && (
        <CVDrawer
          cv={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
