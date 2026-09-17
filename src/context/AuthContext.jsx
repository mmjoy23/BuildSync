import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { ApiError } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On application startup, restore session via GET /api/auth/me
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      try {
        const response = await api.auth.getMe();
        if (isMounted && response && response.user) {
          // Normalize backend role (e.g. 'OWNER') to lowercase 'owner' for router consistency
          const user = {
            ...response.user,
            role: response.user.role.toLowerCase(),
            originalRole: response.user.role,
          };
          setCurrentUser(user);
        }
      } catch {
        // Not authenticated or session expired - keep currentUser null
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      if (!response || !response.user) {
        throw new Error('Invalid response from server');
      }
      const user = {
        ...response.user,
        role: response.user.role.toLowerCase(),
        originalRole: response.user.role,
      };
      setCurrentUser(user);
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.warn('Logout API failed or session already cleared:', e.message);
    } finally {
      setCurrentUser(null);
      window.sessionStorage.clear();
    }
  };

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    login,
    logout,
  }), [currentUser, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function getRoleHome(role) {
  const normalized = (role || '').toLowerCase();
  return normalized === 'owner' ? '/owner/dashboard' : normalized === 'tenant' ? '/tenant/dashboard' : '/admin/dashboard';
}
