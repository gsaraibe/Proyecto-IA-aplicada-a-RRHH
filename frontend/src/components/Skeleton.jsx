import React from 'react';
import styles from './Skeleton.module.css';

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className={styles.statCard}>
      <Skeleton width={44} height={44} borderRadius={10} />
      <div className={styles.statBody}>
        <Skeleton width="60%" height={28} />
        <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
      </div>
    </div>
  );
}

export function CVCardSkeleton() {
  return (
    <div className={styles.cvCard}>
      <div className={styles.cvTop}>
        <Skeleton width={40} height={40} borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
        </div>
        <Skeleton width={48} height={48} borderRadius="50%" />
      </div>
      <Skeleton width="100%" height={8} style={{ marginTop: 12 }} />
      <div className={styles.cvSkills}>
        <Skeleton width={60} height={22} borderRadius={4} />
        <Skeleton width={70} height={22} borderRadius={4} />
        <Skeleton width={50} height={22} borderRadius={4} />
      </div>
      <div className={styles.cvFooter}>
        <Skeleton width={80} height={22} borderRadius={20} />
        <Skeleton width={60} height={12} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '12px' }}>
          <Skeleton width={i === 0 ? '70%' : '50%'} height={14} />
        </td>
      ))}
    </tr>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <Skeleton width={220} height={28} style={{ marginBottom: 8 }} />
      <Skeleton width={280} height={16} style={{ marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div className={styles.chartSkeleton}><Skeleton width="100%" height="100%" /></div>
        <div className={styles.chartSkeleton}><Skeleton width="100%" height="100%" /></div>
      </div>
    </div>
  );
}
