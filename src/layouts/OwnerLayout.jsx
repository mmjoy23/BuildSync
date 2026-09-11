import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PageContainer from '../components/layout/PageContainer';

const ownerNavItems = [
  { type: 'section', label: 'Overview' },
  { to: '/owner/dashboard',   label: 'Dashboard',          iconName: 'bar-chart-2' },
  { type: 'section', label: 'Management' },
  { to: '/owner/properties',  label: 'My Properties',      iconName: 'building' },
  { to: '/owner/tenants',     label: 'Tenants',            iconName: 'users' },
  { to: '/owner/billing',     label: 'Billing & Payments', iconName: 'credit-card' },
  { to: '/owner/utilities',   label: 'Utilities',          iconName: 'zap' },
  { to: '/owner/parking',     label: 'Parking',            iconName: 'car' },
  { to: '/owner/maintenance', label: 'Maintenance',        iconName: 'wrench' },
  { type: 'section', label: 'Communication & Admin' },
  { to: '/owner/notices',     label: 'Notices',            iconName: 'clipboard-list' },
  { to: '/owner/messages',    label: 'Messages',           iconName: 'mail', badge: 3 },
  { to: '/owner/reports',     label: 'Reports',            iconName: 'file-text' },
  { to: '/owner/settings',    label: 'Settings',           iconName: 'settings' },
];

const ownerUser = {
  name: 'Samiul Bashar',
  role: 'Property Owner',
  avatarColor: 'blue',
};

/**
 * OwnerLayout
 * Role-based application shell for Property Owners.
 * "Manage properties, tenants, finances and operations."
 */
function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        brandName="BuildSync"
        role="Owner Portal"
        items={ownerNavItems}
        user={ownerUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-shell">
        <Navbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search anything..."
          userName={ownerUser.name}
          userRole="Owner"
          notificationCount={4}
        />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}

export default OwnerLayout;
