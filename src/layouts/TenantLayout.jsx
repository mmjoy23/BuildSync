import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

const tenantNavItems = [
  { type: 'section', label: 'My Home' },
  { to: '/tenant/dashboard',   label: 'Dashboard',   iconName: 'bar-chart-2' },
  { to: '/tenant/flat',        label: 'My Flat',     iconName: 'home' },
  { type: 'section', label: 'Payments & Finance' },
  { to: '/tenant/bills',       label: 'My Bills',    iconName: 'file-text' },
  { to: '/tenant/payments',    label: 'Payments',    iconName: 'credit-card' },
  { type: 'section', label: 'Services & Requests' },
  { to: '/tenant/maintenance', label: 'Maintenance', iconName: 'wrench' },
  { to: '/tenant/parking',     label: 'Parking',     iconName: 'car' },
  { type: 'section', label: 'Community' },
  { to: '/tenant/messages',    label: 'Messages',    iconName: 'mail', badge: 1 },
  { to: '/tenant/notices',     label: 'Notices',     iconName: 'clipboard-list' },
  { to: '/tenant/profile',     label: 'Profile',     iconName: 'user' },
];

/**
 * TenantLayout
 * Role-based application shell for Residential Tenants.
 * "Manage my flat, bills, payments, requests and communication."
 */
function TenantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const sessionTenant = { name: currentUser?.name || 'Tanjim Ahmed', role: 'Flat 3A Tenant', avatarColor: 'green' };

  return (
    <div className="app-shell">
      <Sidebar
        brandName="BuildSync"
        role="Tenant Portal"
        items={tenantNavItems}
        user={sessionTenant}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-shell">
        <Navbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search bills, requests, notices..."
          userName={sessionTenant.name}
          userRole="Tenant"
          notificationCount={2}
          onUserAction={(action) => {
            if (action === 'logout') { logout(); navigate('/login', { replace: true }); }
            if (action === 'settings') navigate('/tenant/profile');
          }}
        />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}

export default TenantLayout;
