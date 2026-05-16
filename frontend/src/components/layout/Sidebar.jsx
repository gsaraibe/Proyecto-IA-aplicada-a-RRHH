'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import {
  LayoutDashboard, FileSearch, Stethoscope, Settings,
  LogOut, BrainCircuit, X, Home,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/menu',          label: 'Inicio',                  icon: Home,            desc: 'Menú principal' },
  { href: '/cv-dashboard',  label: 'Dashboard Candidatos',    icon: LayoutDashboard, desc: 'Pantalla 1' },
  { href: '/cv-analysis',   label: 'Análisis de CVs',         icon: FileSearch,      desc: 'Pantalla 2' },
  { href: '/hr-tests',      label: 'Herramientas HR',         icon: Stethoscope,     desc: 'Pantalla 3' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 z-40 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/50">
          <Link href="/menu" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none">CH Assist</span>
              <p className="text-slate-400 text-xs leading-none mt-0.5">IA para RRHH</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Pantallas
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <Icon
                  size={18}
                  className={`flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}
                />
                {label}
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Sistema
            </p>
            <Link
              href="/settings"
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${pathname === '/settings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <Settings size={18} className={`flex-shrink-0 ${pathname === '/settings' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
              Configuración
            </Link>
          </div>
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-slate-700/50">
          <Link
            href="/profile"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group mb-1
              ${pathname === '/profile'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
          >
            <Avatar name={user?.name || ''} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                       text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150"
          >
            <LogOut size={16} className="flex-shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
