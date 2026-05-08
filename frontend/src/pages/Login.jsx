import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('¡Bienvenido de vuelta!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Email o contraseña incorrectos. Revisá tus datos.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'demo@gestionrh.app', password: 'Demo1234' });
    toast.info('Datos demo cargados. Hacé clic en Ingresar.');
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <span className={styles.brandIcon}>⚡</span>
            <span className={styles.brandName}>GestiónRH</span>
          </div>
          <h2 className={styles.brandTagline}>
            Transformá tu proceso de<br />
            <span>selección de talentos</span><br />
            con inteligencia artificial.
          </h2>
          <div className={styles.features}>
            {['Análisis automático de CVs con IA', 'Pruebas psicotécnicas inteligentes', 'Dashboard de métricas en tiempo real', 'Gestión completa de candidatos'].map(f => (
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
            <h1>Bienvenido de vuelta</h1>
            <p>Ingresá a tu cuenta para continuar</p>
          </div>

          <button type="button" className={styles.demoBtn} onClick={fillDemo}>
            <span>👤</span> Usar cuenta demo
          </button>

          <div className={styles.divider}><span>o ingresá con tu cuenta</span></div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label htmlFor="password">Contraseña</label>
                <Link to="/forgot-password" className={styles.forgotLink}>¿Olvidaste tu contraseña?</Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className={styles.switchLink}>
            ¿No tenés cuenta? <Link to="/register">Registrarse</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
