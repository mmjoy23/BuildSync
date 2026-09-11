import React, { createContext, useContext, useMemo, useState } from 'react';
import { AUTH_STORAGE_KEY, findAccount } from '../data/authData';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  const login = (email, password) => {
    const user = findAccount(email, password);
    if (!user) return null;
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.clear();
    setCurrentUser(null);
  };

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
  }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function getRoleHome(role) {
  return role === 'owner' ? '/owner/dashboard' : role === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard';
}
