import React from 'react';

const MAP = {
  pending:     { label: 'Pendiente',     bg: '#FEF3C7', color: '#92400E' },
  reviewing:   { label: 'En revisión',   bg: '#DBEAFE', color: '#1E40AF' },
  approved:    { label: 'Aprobado',      bg: '#D1FAE5', color: '#065F46' },
  rejected:    { label: 'Rechazado',     bg: '#FEE2E2', color: '#991B1B' },
  hired:       { label: 'Contratado',    bg: '#EDE9FE', color: '#4C1D95' },
  scheduled:   { label: 'Programada',   bg: '#DBEAFE', color: '#1E40AF' },
  in_progress: { label: 'En progreso',  bg: '#FEF3C7', color: '#92400E' },
  completed:   { label: 'Completada',   bg: '#D1FAE5', color: '#065F46' },
  expired:     { label: 'Expirada',     bg: '#F3F4F6', color: '#374151' },
  technical:   { label: 'Técnica',      bg: '#EDE9FE', color: '#4C1D95' },
  personality: { label: 'Personalidad', bg: '#FCE7F3', color: '#9D174D' },
  cognitive:   { label: 'Cognitiva',    bg: '#DBEAFE', color: '#1E40AF' },
  leadership:  { label: 'Liderazgo',    bg: '#FEF3C7', color: '#92400E' },
  emotional:   { label: 'Emocional',    bg: '#D1FAE5', color: '#065F46' },
};

export default function Badge({ type, custom }) {
  const info = MAP[type] || { label: type, bg: '#F3F4F6', color: '#374151' };
  const label = custom || info.label;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      background: info.bg,
      color: info.color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
