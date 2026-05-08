import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import styles from './HRTests.module.css';

const TEST_TYPES = ['', 'technical', 'personality', 'cognitive', 'leadership', 'emotional'];
const TYPE_LABELS = { '': 'Todos', technical: 'Técnica', personality: 'Personalidad', cognitive: 'Cognitiva', leadership: 'Liderazgo', emotional: 'Emocional' };
const TYPE_ICONS = { technical: '💻', personality: '🧬', cognitive: '🧠', leadership: '🎯', emotional: '❤️' };

function RadarChart({ categories }) {
  if (!categories?.length) return null;
  const n = categories.length;
  const cx = 100, cy = 100, r = 70;
  const angles = categories.map((_, i) => (i * 2 * Math.PI / n) - Math.PI / 2);

  const points = categories.map((cat, i) => ({
    x: cx + r * (cat.score / 100) * Math.cos(angles[i]),
    y: cy + r * (cat.score / 100) * Math.sin(angles[i]),
  }));

  const gridPoints = (fraction) => categories.map((_, i) => ({
    x: cx + r * fraction * Math.cos(angles[i]),
    y: cy + r * fraction * Math.sin(angles[i]),
  }));

  const toPath = pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ display: 'block', margin: '0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={gridPoints(f).map(p => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="#E5E7EB" strokeWidth="1" />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#E5E7EB" strokeWidth="1" />
      ))}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(79,70,229,0.2)" stroke="#4F46E5" strokeWidth="2" />
      {categories.map((cat, i) => {
        const lx = cx + (r + 18) * Math.cos(angles[i]);
        const ly = cy + (r + 18) * Math.sin(angles[i]);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6B7280">{cat.name}</text>
        );
      })}
    </svg>
  );
}

function TestDrawer({ test, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <div>
            <h2>{test.candidateName}</h2>
            <p>{test.position} · <Badge type={test.testType} /></p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.drawerSection}>
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <span>Estado</span>
                <Badge type={test.status} />
              </div>
              <div className={styles.metaItem}>
                <span>Duración</span>
                <strong>{test.duration} min</strong>
              </div>
              {test.score !== null && (
                <div className={styles.metaItem}>
                  <span>Score</span>
                  <strong style={{ color: test.score >= 80 ? '#10B981' : test.score >= 60 ? '#F59E0B' : '#EF4444', fontSize: 22 }}>{test.score}</strong>
                </div>
              )}
            </div>
          </div>

          {test.status === 'completed' && test.results?.categories?.length > 0 && (
            <div className={styles.drawerSection}>
              <h4>Resultados por categoría</h4>
              <RadarChart categories={test.results.categories} />
              <div className={styles.categoryList}>
                {test.results.categories.map(cat => (
                  <div key={cat.name} className={styles.categoryItem}>
                    <span>{cat.name}</span>
                    <div className={styles.catBar}>
                      <div style={{ width: `${cat.score}%`, height: '100%', background: cat.score >= 80 ? '#10B981' : cat.score >= 60 ? '#F59E0B' : '#EF4444', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'right' }}>{cat.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {test.results?.summary && (
            <div className={styles.drawerSection}>
              <h4>Resumen</h4>
              <p className={styles.summary}>{test.results.summary}</p>
            </div>
          )}

          {test.results?.recommendation && (
            <div className={styles.drawerSection}>
              <h4>Recomendación</h4>
              <div className={styles.recBox}>
                <span>💡</span>
                <p>{test.results.recommendation}</p>
              </div>
            </div>
          )}

          {test.scheduledAt && (
            <div className={styles.drawerSection}>
              <h4>Fechas</h4>
              <div className={styles.infoGrid}>
                <span>📅 Programada: {new Date(test.scheduledAt).toLocaleDateString('es-AR')}</span>
                {test.completedAt && <span>✅ Completada: {new Date(test.completedAt).toLocaleDateString('es-AR')}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HRTests() {
  const [tests, setTests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const fetchTests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (typeFilter) params.append('testType', typeFilter);
      const res = await api.get(`/tests?${params}`);
      setTests(res.data.tests);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      toast.error('No se pudieron cargar las pruebas. Verificá tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, page]);

  useEffect(() => { fetchTests(); }, [fetchTests]);
  useEffect(() => { setPage(1); }, [typeFilter]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Pruebas de HR"
        subtitle={`${total} pruebas en total`}
      />

      <Card className={styles.filterCard}>
        <div className={styles.typeFilters}>
          {TEST_TYPES.map(t => (
            <button
              key={t}
              className={`${styles.filterBtn} ${typeFilter === t ? styles.active : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t && <span>{TYPE_ICONS[t]}</span>}
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid #F9FAFB' }}>
                <Skeleton width={40} height={40} borderRadius={10} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton width="50%" height={14} />
                  <Skeleton width="35%" height={12} />
                </div>
                <Skeleton width={80} height={22} borderRadius={20} />
                <Skeleton width={60} height={22} borderRadius={20} />
                <Skeleton width={30} height={20} />
              </div>
            ))}
          </div>
        </Card>
      ) : tests.length === 0 ? (
        <Card>
          <EmptyState
            preset={typeFilter ? 'search' : 'tests'}
            action={typeFilter ? () => setTypeFilter('') : undefined}
            actionLabel={typeFilter ? 'Ver todas las pruebas' : undefined}
          />
        </Card>
      ) : (
        <>
          <div className={styles.list}>
            {tests.map(test => (
              <Card key={test._id} className={styles.testRow} style={{ cursor: 'pointer' }} >
                <div className={styles.testRowInner} onClick={() => setSelected(test)}>
                  <div className={styles.testIcon}>{TYPE_ICONS[test.testType] || '📊'}</div>
                  <div className={styles.testInfo}>
                    <div className={styles.testName}>{test.candidateName}</div>
                    <div className={styles.testPosition}>{test.position}</div>
                  </div>
                  <div className={styles.testMeta}>
                    <Badge type={test.testType} />
                    <Badge type={test.status} />
                  </div>
                  <div className={styles.testScore}>
                    {test.score !== null ? (
                      <span style={{ fontSize: 18, fontWeight: 700, color: test.score >= 80 ? '#10B981' : test.score >= 60 ? '#F59E0B' : '#EF4444' }}>{test.score}</span>
                    ) : (
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </div>
                  <div className={styles.testDate}>
                    {test.scheduledAt ? new Date(test.scheduledAt).toLocaleDateString('es-AR') : '—'}
                  </div>
                  <span className={styles.arrow}>→</span>
                </div>
              </Card>
            ))}
          </div>

          {pages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Anterior</button>
              <span>{page} / {pages}</span>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Siguiente →</button>
            </div>
          )}
        </>
      )}

      {selected && <TestDrawer test={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
