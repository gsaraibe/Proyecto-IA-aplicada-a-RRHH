import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.illustration}>
          <span className={styles.code}>404</span>
          <span className={styles.emoji}>🔍</span>
        </div>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>
          La dirección que ingresaste no existe o fue movida.<br />
          Puede que hayas escrito mal la URL o que el enlace esté desactualizado.
        </p>
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Volver atrás
          </button>
          <Link to={user ? '/dashboard' : '/login'} className={styles.homeBtn}>
            {user ? 'Ir al Dashboard' : 'Ir al inicio de sesión'}
          </Link>
        </div>
      </div>
    </div>
  );
}
