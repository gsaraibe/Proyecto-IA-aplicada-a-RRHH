'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, FileSearch, Stethoscope, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';

const SCREENS = [
  {
    href: '/cv-dashboard',
    number: '01',
    label: 'Dashboard de Candidatos',
    description: 'Visualizá todos los análisis de CVs realizados con IA. Métricas, ranking de candidatos, filtros y acceso rápido a cada resultado.',
    icon: LayoutDashboard,
    gradient: 'from-indigo-500 to-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconColor: 'text-indigo-600',
    tags: ['Métricas', 'Tabla de candidatos', 'Filtros', 'Exportación'],
  },
  {
    href: '/cv-analysis',
    number: '02',
    label: 'Análisis de CVs',
    description: 'Subí un CV o múltiples CVs (ZIP) junto a la descripción del puesto y obtené un análisis objetivo, estructurado y libre de sesgos generado por IA.',
    icon: FileSearch,
    gradient: 'from-violet-500 to-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-600',
    tags: ['Upload de CVs', 'Análisis con IA', 'Score 0-100', 'Exportar PDF/Excel'],
  },
  {
    href: '/hr-tests',
    number: '03',
    label: 'Herramientas HR',
    description: 'Generá planes de onboarding personalizados para nuevos colaboradores con IA. Plan de 30 días con tareas, responsables y seguimiento de progreso.',
    icon: Stethoscope,
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconColor: 'text-emerald-600',
    tags: ['Plan de Onboarding', '4 semanas', 'Checkboxes', 'Guardado en DB'],
  },
];

export default function MenuPage() {
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero header */}
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-4">
          <BrainCircuit size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          {greeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-2 text-base max-w-xl mx-auto">
          Bienvenido a <span className="font-semibold text-indigo-600">CH Assist</span> — tu asistente de Recursos Humanos potenciado por inteligencia artificial.
          <br />Elegí la herramienta que necesitás para empezar.
        </p>
      </div>

      {/* Screen cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SCREENS.map((screen) => {
          const Icon = screen.icon;
          return (
            <Link
              key={screen.href}
              href={screen.href}
              className={`group block relative rounded-2xl border ${screen.border} ${screen.bg} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              {/* Number badge */}
              <span className="absolute top-4 right-4 text-xs font-bold text-slate-300 font-mono">{screen.number}</span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${screen.gradient} flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon size={22} className="text-white" />
              </div>

              {/* Content */}
              <h2 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{screen.label}</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{screen.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {screen.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded-full bg-white border ${screen.border} ${screen.iconColor} font-medium`}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className={`flex items-center gap-1.5 text-sm font-semibold ${screen.iconColor} group-hover:gap-2.5 transition-all`}>
                Ir a la pantalla <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pb-4">
        <Sparkles size={13} />
        <span>Todas las funciones de IA requieren una API Key configurada en</span>
        <Link href="/settings" className="text-indigo-500 hover:text-indigo-600 font-medium underline underline-offset-2">Configuración</Link>
      </div>
    </div>
  );
}
