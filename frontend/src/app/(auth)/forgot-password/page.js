'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Sparkles, ArrowLeft, Mail } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Revisá tu email</h2>
              <p className="text-slate-400 text-sm mb-6">
                Si el email existe en nuestro sistema, recibirás las instrucciones para recuperar tu contraseña en breve.
              </p>
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                ← Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-1">Recuperar contraseña</h2>
              <p className="text-slate-400 text-sm mb-6">
                Ingresá tu email y te enviaremos las instrucciones para recuperar el acceso.
              </p>

              {error && <Alert variant="error" message={error} onClose={() => setError('')} className="mb-4" />}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white
                               placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2
                               focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full btn-lg !rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
                >
                  Enviar instrucciones
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  <ArrowLeft size={14} />
                  Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
