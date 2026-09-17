import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

const adminNavItems = [
  { type: 'section', label: 'Platform' },
  { to: '/admin/dashboard',   label: 'Dashboard',        iconName: 'bar-chart-2' },
  { type: 'section', label: 'User Directory' },
  { to: '/admin/users',       label: 'Users',            iconName: 'users' },
  { to: '/admin/owners',      label: 'Owners',           iconName: 'user' },
  { to: '/admin/tenants',     label: 'Tenants',          iconName: 'home' },
  { type: 'section', label: 'Infrastructure & Support' },
  { to: '/admin/properties',  label: 'Properties',       iconName: 'building' },
  { to: '/admin/support',     label: 'Support Tickets',  iconName: 'headphones', badge: 5 },
  { to: '/admin/messages',    label: 'Messages',         iconName: 'mail' },
  { to: '/admin/reports',     label: 'Reports',          iconName: 'file-text' },
  { to: '/admin/settings',    label: 'System Settings',  iconName: 'settings' },
];

/**
 * AdminLayout
 * Role-based application shell for Platform Administrators.
 * "Manage users, support and the platform."
 */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const sessionAdmin = { name: currentUser?.name || 'Admin', role: 'Super Administrator', avatarColor: 'purple' };

  return (
    <div className="app-shell">
      <Sidebar
        brandName="BuildSync"
        role="Admin Portal"
        items={adminNavItems}
        user={sessionAdmin}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-shell">
        <Navbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search system users, logs, tickets..."
          userName={sessionAdmin.name}
          userRole="Admin"
          onUserAction={(action) => {
            if (action === 'logout') { logout(); navigate('/login', { replace: true }); }
            if (action === 'settings') navigate('/admin/settings');
          }}
        />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}

export default AdminLayout;
