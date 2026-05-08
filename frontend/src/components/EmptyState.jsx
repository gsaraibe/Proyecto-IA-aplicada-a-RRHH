import React from 'react';
import styles from './EmptyState.module.css';

const PRESETS = {
  cvs: {
    icon: '📄',
    title: 'Todavía no hay CVs cargados',
    description: 'Cuando empieces a recibir postulaciones, aparecerán acá con su análisis de IA automático.',
    actionLabel: 'Entendido',
  },
  tests: {
    icon: '📊',
    title: 'No hay pruebas asignadas',
    description: 'Las pruebas psicotécnicas que asignes a candidatos aparecerán en esta lista.',
    actionLabel: 'Entendido',
  },
  search: {
    icon: '🔍',
    title: 'No encontramos resultados',
    description: 'Intentá con otros términos o quitá los filtros aplicados.',
    actionLabel: 'Limpiar búsqueda',
  },
  generic: {
    icon: '📭',
    title: 'Nada por aquí',
    description: 'Esta sección está vacía por el momento.',
    actionLabel: null,
  },
};

export default function EmptyState({ preset = 'generic', title, description, icon, action, actionLabel }) {
  const p = PRESETS[preset] || PRESETS.generic;
  const finalIcon        = icon        || p.icon;
  const finalTitle       = title       || p.title;
  const finalDescription = description || p.description;
  const finalLabel       = actionLabel || p.actionLabel;

  return (
    <div className={styles.wrap}>
      <div className={styles.iconCircle}>
        <span className={styles.icon}>{finalIcon}</span>
      </div>
      <h3 className={styles.title}>{finalTitle}</h3>
      <p className={styles.description}>{finalDescription}</p>
      {action && finalLabel && (
        <button className={styles.action} onClick={action}>
          {finalLabel}
        </button>
      )}
    </div>
  );
}
