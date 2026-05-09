'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const inputClass = `w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white
                      placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2
                      focus:ring-indigo-500 focus:border-transparent transition-all`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TalentAI</h1>
          <p className="text-slate-400 mt-1 text-sm">Plataforma inteligente de RRHH</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Crear cuenta</h2>
          <p className="text-slate-400 text-sm mb-6">Completá tus datos para empezar</p>

          {error && <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4 !bg-red-900/30 !border-red-500/30 !text-red-300" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Nombre completo</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Juan Pérez" required className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="tu@email.com" required className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1.5">Confirmar contraseña</label>
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repetí tu contraseña" required className={inputClass} />
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="w-full btn-lg !rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
            >
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
