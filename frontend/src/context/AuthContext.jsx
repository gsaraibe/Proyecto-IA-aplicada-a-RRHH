import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ts_token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('ts_token'); localStorage.removeItem('ts_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('ts_token', res.data.token);
    localStorage.setItem('ts_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('ts_token', res.data.token);
    localStorage.setItem('ts_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ts_token');
    localStorage.removeItem('ts_user');
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data) => {
    const res = await api.put('/auth/me', data);
    localStorage.setItem('ts_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
