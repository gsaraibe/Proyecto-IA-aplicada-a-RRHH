import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';
import fpStyles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) {
      return setError('Por favor ingresá un email válido.');
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('sent');
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
            Recuperá el acceso<br />
            <span>a tu cuenta</span><br />
            en segundos.
          </h2>
          <div className={styles.features}>
            {[
              'Enviamos un enlace seguro a tu email',
              'El enlace expira en 30 minutos',
              'Si no ves el correo, revisá la carpeta de spam',
              'Tu contraseña actual no cambia hasta que uses el enlace',
            ].map(f => (
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
          {step === 'form' ? (
            <>
              <Link to="/login" className={fpStyles.backLink}>← Volver al inicio de sesión</Link>

              <div className={styles.authHeader}>
                <h1>Olvidaste tu contraseña</h1>
                <p>Ingresá tu email y te enviamos un enlace para recuperar el acceso.</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorBox}>{error}</div>}

                <div className={styles.field}>
                  <label htmlFor="email">Email de tu cuenta</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    autoFocus
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <span className={fpStyles.loadingInner}>
                      <span className={fpStyles.btnSpinner} />
                      Enviando...
                    </span>
                  ) : 'Enviar enlace de recuperación'}
                </button>
              </form>

              <p className={styles.switchLink}>
                ¿Acordaste la contraseña? <Link to="/login">Iniciar sesión</Link>
              </p>
            </>
          ) : (
            <div className={fpStyles.successState}>
              <div className={fpStyles.successIcon}>📬</div>
              <h2>¡Revisá tu correo!</h2>
              <p>
                Si la dirección <strong>{email}</strong> está registrada en GestiónRH,
                vas a recibir un email con el enlace para crear una nueva contraseña.
              </p>
              <div className={fpStyles.tips}>
                <div className={fpStyles.tip}>
                  <span>📁</span>
                  <span>Si no aparece en la bandeja principal, revisá la carpeta de <strong>spam</strong> o <strong>correo no deseado</strong>.</span>
                </div>
                <div className={fpStyles.tip}>
                  <span>⏱</span>
                  <span>El enlace es válido por <strong>30 minutos</strong> desde que lo enviamos.</span>
                </div>
              </div>
              <div className={fpStyles.successActions}>
                <button className={fpStyles.retryBtn} onClick={() => { setStep('form'); setEmail(''); }}>
                  Intentar con otro email
                </button>
                <Link to="/login" className={fpStyles.loginLink}>Volver al inicio de sesión</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
