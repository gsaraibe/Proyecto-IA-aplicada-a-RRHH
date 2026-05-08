import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CVAnalysis from './pages/CVAnalysis';
import HRTests from './pages/HRTests';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import styles from './App.module.css';

const AppLoader = () => (
  <div className={styles.appLoader}>
    <div className={styles.loaderContent}>
      <span className={styles.loaderIcon}>⚡</span>
      <span className={styles.loaderName}>TalentStream AI</span>
      <div className={styles.loaderBar}><div className={styles.loaderFill} /></div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="cvs"       element={<CVAnalysis />} />
      <Route path="tests"     element={<HRTests />} />
      <Route path="settings"  element={<Settings />} />
      <Route path="profile"   element={<Profile />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
