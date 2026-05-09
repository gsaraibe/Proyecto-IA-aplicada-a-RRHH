'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@talentai.com', password: 'Demo123!' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TalentAI</h1>
          <p className="text-slate-400 mt-1 text-sm">Plataforma inteligente de RRHH</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Bienvenido de nuevo</h2>
          <p className="text-slate-400 text-sm mb-6">Ingresá tu email y contraseña para continuar</p>

          {error && <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                required
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white
                           placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2
                           focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Tu contraseña"
                  required
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white
                             placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2
                             focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="w-full btn-lg !rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
            >
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Registrate gratis
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-5 p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <p className="text-xs text-indigo-300 text-center mb-2 font-medium">
              ✨ Usuario de demostración
            </p>
            <div className="text-xs text-slate-400 text-center space-y-0.5 mb-2">
              <p>📧 demo@talentai.com</p>
              <p>🔑 Demo123!</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full text-xs text-indigo-400 hover:text-indigo-300 font-medium
                         py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
            >
              Completar automáticamente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
