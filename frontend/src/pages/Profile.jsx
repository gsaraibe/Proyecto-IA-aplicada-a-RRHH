import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import styles from './Profile.module.css';

const ROLE_LABELS = { admin: 'Administrador', manager: 'Gerente', recruiter: 'Reclutador' };

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateUser(form);
      setSaved(true);
      toast.success('Perfil actualizado correctamente.');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      const msg = 'Error al guardar los cambios. Intentá nuevamente.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className={styles.page}>
      <PageHeader title="Mi Perfil" subtitle="Administrá tu información personal" />

      <div className={styles.grid}>
        <Card className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <h2 className={styles.profileName}>{user?.name}</h2>
              <span className={styles.profileRole}>{ROLE_LABELS[user?.role] || user?.role}</span>
              <div className={styles.profileEmail}>{user?.email}</div>
            </div>
          </div>

          <div className={styles.profileMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Departamento</span>
              <span className={styles.metaValue}>{user?.department || '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Teléfono</span>
              <span className={styles.metaValue}>{user?.phone || '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Miembro desde</span>
              <span className={styles.metaValue}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' }) : '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Estado de cuenta</span>
              <span className={styles.badge}>● Activa</span>
            </div>
          </div>
        </Card>

        <Card className={styles.editCard}>
          <h3 className={styles.editTitle}>Editar información</h3>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBox}>{error}</div>}
            {saved && <div className={styles.successBox}>✓ Cambios guardados correctamente</div>}

            <div className={styles.field}>
              <label>Nombre completo</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={user?.email} disabled className={styles.disabled} />
              <span className={styles.hint}>El email no puede modificarse</span>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Departamento</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} placeholder="Ej: Recursos Humanos" />
              </div>
              <div className={styles.field}>
                <label>Teléfono</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Ej: +54 11 1234-5678" />
              </div>
            </div>

            <div className={styles.field}>
              <label>Rol</label>
              <input value={ROLE_LABELS[user?.role] || user?.role} disabled className={styles.disabled} />
              <span className={styles.hint}>El rol es asignado por un administrador</span>
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </Card>
      </div>

      <Card className={styles.securityCard}>
        <h3 className={styles.editTitle}>Seguridad</h3>
        <div className={styles.securityInfo}>
          <div className={styles.securityItem}>
            <span className={styles.secIcon}>🔐</span>
            <div>
              <div className={styles.secLabel}>Contraseña</div>
              <div className={styles.secDesc}>Tu contraseña fue actualizada hace menos de 30 días</div>
            </div>
            <span className={styles.secBadge}>Segura</span>
          </div>
          <div className={styles.securityItem}>
            <span className={styles.secIcon}>🔑</span>
            <div>
              <div className={styles.secLabel}>Autenticación JWT</div>
              <div className={styles.secDesc}>Token válido por 7 días a partir del último inicio de sesión</div>
            </div>
            <span className={styles.secBadge}>Activa</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
