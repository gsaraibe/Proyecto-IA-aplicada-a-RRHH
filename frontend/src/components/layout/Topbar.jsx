'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import { Menu, Bell } from 'lucide-react';

const PAGE_LABELS = {
  '/dashboard':  'Dashboard',
  '/employees':  'Empleados',
  '/jobs':       'Vacantes',
  '/candidates': 'Candidatos',
  '/profile':    'Mi perfil',
};

export default function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const label = PAGE_LABELS[pathname] || 'TalentAI';

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between flex-shrink-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{label}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2.5">
          <Avatar name={user?.name || ''} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">{user?.name}</p>
            <p className="text-xs text-slate-400 leading-tight capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
