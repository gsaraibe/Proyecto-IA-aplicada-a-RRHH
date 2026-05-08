import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'recruiter', department: 'Recursos Humanos' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (form.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role, department: form.department });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <span className={styles.brandIcon}>⚡</span>
            <span className={styles.brandName}>TalentStream<span>AI</span></span>
          </div>
          <h2 className={styles.brandTagline}>
            Empezá hoy a gestionar<br />
            <span>tu equipo con IA</span><br />
            de forma inteligente.
          </h2>
          <div className={styles.features}>
            {['Creá tu cuenta en segundos', 'Acceso completo a todas las funciones', 'Sin tarjeta de crédito requerida', 'Soporte dedicado incluido'].map(f => (
              <div key={f} className={styles.feature}>
                <span className={styles.featureCheck}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>Crear cuenta</h1>
            <p>Completá tus datos para comenzar</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.field}>
              <label>Nombre completo</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Juan Pérez" required />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="juan@empresa.com" required />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Rol</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="recruiter">Reclutador</option>
                  <option value="manager">Gerente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Departamento</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} placeholder="Recursos Humanos" />
              </div>
            </div>

            <div className={styles.field}>
              <label>Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
            </div>

            <div className={styles.field}>
              <label>Confirmar contraseña</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repetí tu contraseña" required />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className={styles.switchLink}>
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
