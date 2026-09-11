import React from 'react';
import Badge from '../../../components/common/Badge';
import { adminProfile } from '../../../data/adminDashboardData';
import { useAuth } from '../../../context/AuthContext';

/**
 * AdminDashboardHeader
 * Standard header:
 * - "Good Evening, Admin"
 * - "Manage users, handle support, and keep the platform running smoothly."
 */
function AdminDashboardHeader() {
  const { currentUser } = useAuth();
  return (
    <div className="admin-header">
      <div>
        <h1 className="admin-header__greeting">Good Evening, {currentUser?.name || adminProfile.name}</h1>
        <p className="admin-header__subtitle">{adminProfile.subtitle}</p>
      </div>
      <div className="admin-header__badge-cluster">
        <Badge variant="purple" withDot>Super Admin Access</Badge>
      </div>
    </div>
  );
}

export default AdminDashboardHeader;
