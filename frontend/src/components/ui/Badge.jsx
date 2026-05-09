'use client';

const STATUS_CONFIG = {
  active:    { label: 'Activo',        classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  inactive:  { label: 'Inactivo',      classes: 'bg-slate-100  text-slate-600   ring-slate-200'  },
  vacation:  { label: 'Vacaciones',    classes: 'bg-amber-50   text-amber-700   ring-amber-200'  },
  open:      { label: 'Abierta',       classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  closed:    { label: 'Cerrada',       classes: 'bg-slate-100  text-slate-600   ring-slate-200'  },
  draft:     { label: 'Borrador',      classes: 'bg-blue-50    text-blue-700    ring-blue-200'   },
  new:       { label: 'Nuevo',         classes: 'bg-indigo-50  text-indigo-700  ring-indigo-200' },
  screening: { label: 'Screening',     classes: 'bg-purple-50  text-purple-700  ring-purple-200' },
  interview: { label: 'Entrevista',    classes: 'bg-amber-50   text-amber-700   ring-amber-200'  },
  offer:     { label: 'Oferta',        classes: 'bg-sky-50     text-sky-700     ring-sky-200'    },
  hired:     { label: 'Contratado/a',  classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  rejected:  { label: 'Rechazado/a',   classes: 'bg-red-50     text-red-700     ring-red-200'    },
  'full-time': { label: 'Tiempo completo', classes: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  'part-time': { label: 'Medio tiempo',   classes: 'bg-purple-50 text-purple-700 ring-purple-200' },
  remote:    { label: 'Remoto',        classes: 'bg-teal-50    text-teal-700    ring-teal-200'   },
  hybrid:    { label: 'Híbrido',       classes: 'bg-blue-50    text-blue-700    ring-blue-200'   },
};

export default function Badge({ status, label, className = '' }) {
  const config = STATUS_CONFIG[status] || { label: status, classes: 'bg-slate-100 text-slate-600 ring-slate-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${config.classes} ${className}`}>
      {label || config.label}
    </span>
  );
}
