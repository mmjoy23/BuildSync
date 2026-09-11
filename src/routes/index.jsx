/**
 * routes/index.jsx
 * Central route configuration for BuildSync.
 *
 * Structure:
 *   /login                → LoginPage (no layout)
 *   /owner/*              → OwnerLayout  + owner sub-pages
 *   /tenant/*             → TenantLayout + tenant sub-pages
 *   /admin/*              → AdminLayout  + admin sub-pages
 *   /                     → redirects to /login
 *   *                     → 404 Not Found
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import OwnerLayout  from '../layouts/OwnerLayout';
import TenantLayout from '../layouts/TenantLayout';
import AdminLayout  from '../layouts/AdminLayout';

// Auth
import LoginPage from '../pages/auth/LoginPage';

// Owner pages
import OwnerDashboard   from '../pages/owner/OwnerDashboard';
import OwnerProperties  from '../pages/owner/OwnerProperties';
import PropertyDetails  from '../pages/owner/PropertyDetails';
import OwnerTenants     from '../pages/owner/OwnerTenants';
import OwnerBilling     from '../pages/owner/OwnerBilling';
import OwnerUtilities   from '../pages/owner/OwnerUtilities';
import OwnerParking     from '../pages/owner/OwnerParking';
import OwnerMaintenance from '../pages/owner/OwnerMaintenance';
import OwnerNotices     from '../pages/owner/OwnerNotices';
import OwnerMessages    from '../pages/owner/OwnerMessages';
import OwnerReports     from '../pages/owner/OwnerReports';
import OwnerSettings    from '../pages/owner/OwnerSettings';

// Tenant pages
import TenantDashboard   from '../pages/tenant/TenantDashboard';
import TenantFlat        from '../pages/tenant/TenantFlat';
import TenantBills       from '../pages/tenant/TenantBills';
import TenantPayments    from '../pages/tenant/TenantPayments';
import TenantMaintenance from '../pages/tenant/TenantMaintenance';
import TenantParking     from '../pages/tenant/TenantParking';
import TenantMessages    from '../pages/tenant/TenantMessages';
import TenantNotices     from '../pages/tenant/TenantNotices';
import TenantProfile     from '../pages/tenant/TenantProfile';

// Admin pages
import AdminDashboard   from '../pages/admin/AdminDashboard';
import AdminUsers       from '../pages/admin/AdminUsers';
import AdminOwners      from '../pages/admin/AdminOwners';
import AdminTenants     from '../pages/admin/AdminTenants';
import AdminProperties  from '../pages/admin/AdminProperties';
import AdminSupport     from '../pages/admin/AdminSupport';
import AdminMessages    from '../pages/admin/AdminMessages';
import AdminReports     from '../pages/admin/AdminReports';
import AdminSettings    from '../pages/admin/AdminSettings';

// 404 fallback
import NotFoundPage from '../pages/NotFoundPage';

// Component showcase / dev demo
import ComponentShowcase from '../pages/ComponentShowcase';

const router = createBrowserRouter([
  // ── Root redirect ─────────────────────────────────────────
  {
    index: true,
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // ── Auth ──────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ── Owner routes ──────────────────────────────────────────
  {
    path: '/owner',
    element: <OwnerLayout />,
    children: [
      { index: true, element: <Navigate to="/owner/dashboard" replace /> },
      { path: 'dashboard',   element: <OwnerDashboard /> },
      { path: 'properties',      element: <OwnerProperties /> },
      { path: 'properties/:id',  element: <PropertyDetails /> },
      { path: 'tenants',         element: <OwnerTenants /> },
      { path: 'billing',     element: <OwnerBilling /> },
      { path: 'utilities',   element: <OwnerUtilities /> },
      { path: 'parking',     element: <OwnerParking /> },
      { path: 'maintenance', element: <OwnerMaintenance /> },
      { path: 'notices',     element: <OwnerNotices /> },
      { path: 'messages',    element: <OwnerMessages /> },
      { path: 'reports',     element: <OwnerReports /> },
      { path: 'settings',    element: <OwnerSettings /> },
    ],
  },

  // ── Tenant routes ─────────────────────────────────────────
  {
    path: '/tenant',
    element: <TenantLayout />,
    children: [
      { index: true, element: <Navigate to="/tenant/dashboard" replace /> },
      { path: 'dashboard',   element: <TenantDashboard /> },
      { path: 'flat',        element: <TenantFlat /> },
      { path: 'bills',       element: <TenantBills /> },
      { path: 'payments',    element: <TenantPayments /> },
      { path: 'maintenance', element: <TenantMaintenance /> },
      { path: 'parking',     element: <TenantParking /> },
      { path: 'messages',    element: <TenantMessages /> },
      { path: 'notices',     element: <TenantNotices /> },
      { path: 'profile',     element: <TenantProfile /> },
    ],
  },

  // ── Admin routes ──────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',   element: <AdminDashboard /> },
      { path: 'users',       element: <AdminUsers /> },
      { path: 'owners',      element: <AdminOwners /> },
      { path: 'tenants',     element: <AdminTenants /> },
      { path: 'properties',  element: <AdminProperties /> },
      { path: 'support',     element: <AdminSupport /> },
      { path: 'messages',    element: <AdminMessages /> },
      { path: 'reports',     element: <AdminReports /> },
      { path: 'settings',    element: <AdminSettings /> },
    ],
  },

  // ── Showcase demo ────────────────────────────────────────
  {
    path: '/showcase',
    element: <ComponentShowcase />,
  },

  // ── 404 catch-all ─────────────────────────────────────────
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
