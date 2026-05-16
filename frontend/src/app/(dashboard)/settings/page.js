'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Key, Save, CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState(null); // { hasApiKey, apiKeyPreview }
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/settings').then((d) => {
      setStatus(d);
    }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/settings', { apiKeyIA: apiKey.trim() });
      setMessage({ type: 'success', text: 'API Key guardada correctamente. Ya podés usar las funciones de IA.' });
      setStatus({ hasApiKey: true, apiKeyPreview: `${apiKey.slice(0, 8)}...` });
      setApiKey('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
        <p className="text-slate-500 text-sm mt-1">Administrá la integración con inteligencia artificial.</p>
      </div>

      {/* API Key card */}
      <div className="card p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Key size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">API Key de Inteligencia Artificial</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Ingresá tu API Key de Anthropic (Claude) para habilitar el análisis de CVs y la generación de planes de onboarding.
            </p>
          </div>
        </div>

        {/* Current status */}
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm ${status?.hasApiKey ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
          {status?.hasApiKey ? (
            <>
              <CheckCircle size={16} className="flex-shrink-0" />
              <span>API Key configurada: <code className="font-mono font-semibold">{status.apiKeyPreview}</code></span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>No hay API Key configurada. Las funciones de IA no estarán disponibles.</span>
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Nueva API Key <span className="text-slate-400 font-normal">(se reemplazará la existente)</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="input-base pr-12 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              La API Key se almacena de forma segura y no se expone en la interfaz.
            </p>
          </div>

          {message && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={!apiKey.trim() || saving}
            className="btn-primary btn-md px-5"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={15} />
                Guardar API Key
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Help card */}
      <div className="card p-5 bg-slate-50 border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">¿Cómo obtengo una API Key?</h3>
        <ol className="text-sm text-slate-500 space-y-1.5 list-decimal list-inside">
          <li>Ingresá a <span className="font-mono text-indigo-600">console.anthropic.com</span></li>
          <li>Creá una cuenta o iniciá sesión</li>
          <li>Ir a &quot;API Keys&quot; en el panel lateral</li>
          <li>Hacé clic en &quot;Create Key&quot;</li>
          <li>Copiá la clave y pegala en el campo de arriba</li>
        </ol>
        <a
          href="https://console.anthropic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-3 transition-colors"
        >
          Ir a Anthropic Console <ExternalLink size={13} />
        </a>
      </div>

      {/* Info about variable */}
      <div className="card p-5 border-blue-100 bg-blue-50">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Alternativa: variable de entorno</h3>
        <p className="text-xs text-blue-600">
          También podés configurar la clave editando el archivo <code className="font-mono font-semibold">.env</code> del backend y estableciendo la variable <code className="font-mono font-semibold">API_KEY_IA=tu-clave-aqui</code>. Si se configura desde esta pantalla, tiene prioridad sobre el archivo .env.
        </p>
      </div>
    </div>
  );
}
