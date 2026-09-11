import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getRoleHome, useAuth } from '../context/AuthContext';

export default function AuthGuard({ role, children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && currentUser.role !== role) return <Navigate to={getRoleHome(currentUser.role)} replace />;
  return children;
}
