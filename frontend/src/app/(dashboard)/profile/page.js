'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import { Save, User, Mail, Phone, Building, Briefcase, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name:       user?.name       || '',
    phone:      user?.phone      || '',
    department: user?.department || '',
    position:   user?.position   || '',
    bio:        user?.bio        || '',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const { user: updated } = await api.put('/auth/profile', form);
      updateUser(updated);
      setFeedback({ type: 'success', msg: 'Perfil actualizado correctamente.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'input-base text-sm';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="page-title">Mi perfil</h2>
        <p className="page-subtitle">Actualizá tu información personal</p>
      </div>

      {/* Avatar section */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <Avatar name={form.name || user?.name || ''} size="xl" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{user?.name}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full ring-1 ring-inset ring-indigo-200 capitalize">
                {user?.role}
              </span>
              {user?.department && (
                <span className="text-xs text-slate-500">{user.department}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-5">Información personal</h3>

        {feedback && (
          <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} className="mb-5" />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                <User size={14} className="text-slate-400" /> Nombre completo
              </label>
              <input value={form.name} onChange={set('name')} required className={inputCls} placeholder="Tu nombre" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                <Mail size={14} className="text-slate-400" /> Email
              </label>
              <input value={user?.email || ''} disabled className={`${inputCls} bg-slate-50 cursor-not-allowed text-slate-500`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                <Phone size={14} className="text-slate-400" /> Teléfono
              </label>
              <input value={form.phone} onChange={set('phone')} className={inputCls} placeholder="+54 11 1234-5678" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                <Building size={14} className="text-slate-400" /> Área / Departamento
              </label>
              <input value={form.department} onChange={set('department')} className={inputCls} placeholder="Recursos Humanos" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
              <Briefcase size={14} className="text-slate-400" /> Cargo
            </label>
            <input value={form.position} onChange={set('position')} className={inputCls} placeholder="Gerente de RRHH" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
              <FileText size={14} className="text-slate-400" /> Biografía / Descripción
            </label>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Contá un poco sobre vos y tu rol..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving} className="btn-md">
              <Save size={15} />
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Información de la cuenta</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Rol</span>
            <span className="font-medium text-slate-700 capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Miembro desde</span>
            <span className="font-medium text-slate-700">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' }) : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">ID de cuenta</span>
            <span className="font-mono text-xs text-slate-400">{user?._id || user?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
