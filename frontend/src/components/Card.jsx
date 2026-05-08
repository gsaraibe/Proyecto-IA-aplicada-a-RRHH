import React from 'react';
import styles from './Card.module.css';

export default function Card({ children, className = '', style }) {
  return <div className={`${styles.card} ${className}`} style={style}>{children}</div>;
}

export function StatCard({ icon, label, value, delta, color = 'primary', subtitle }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statBody}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
        {subtitle && <span className={styles.statSubtitle}>{subtitle}</span>}
      </div>
      {delta !== undefined && (
        <span className={`${styles.delta} ${delta >= 0 ? styles.up : styles.down}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </span>
      )}
    </div>
  );
}
