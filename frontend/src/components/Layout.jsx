import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/cvs', label: 'Análisis de CVs', icon: '📄' },
  { to: '/tests', label: 'Pruebas de HR', icon: '📊' },
  { to: '/settings', label: 'Configuración', icon: '⚙' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          {!collapsed && (
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <span className={styles.logoText}>TalentStream<span className={styles.logoAi}>AI</span></span>
            </div>
          )}
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              title={collapsed ? label : ''}
            >
              <span className={styles.navIcon}>{icon}</span>
              {!collapsed && <span className={styles.navLabel}>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink to="/profile" className={({ isActive }) => `${styles.userItem} ${isActive ? styles.active : ''}`}>
            <div className={styles.avatar}>{initials}</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name}</span>
                <span className={styles.userRole}>{user?.role}</span>
              </div>
            )}
          </NavLink>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            <span>⎋</span>
            {!collapsed && <span>Salir</span>}
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
