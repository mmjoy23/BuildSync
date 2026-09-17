import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getRoleHome, useAuth } from '../context/AuthContext';
import LoadingState from '../components/common/LoadingState';

export default function AuthGuard({ role, children }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingState label="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && currentUser.role !== role) return <Navigate to={getRoleHome(currentUser.role)} replace />;
  return children;
}
