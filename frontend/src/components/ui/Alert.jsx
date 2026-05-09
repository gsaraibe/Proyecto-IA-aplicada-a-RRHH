'use client';

import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />,
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />,
  },
};

export default function Alert({ variant = 'info', message, onClose, className = '' }) {
  if (!message) return null;
  const { container, icon } = VARIANTS[variant];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${container} ${className}`}>
      {icon}
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
