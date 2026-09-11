import React, { useState } from 'react';
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminSummaryCards from './components/AdminSummaryCards';
import SupportTickets from './components/SupportTickets';
import PlatformActivityChart from './components/PlatformActivityChart';
import RecentMessages from './components/RecentMessages';
import SystemHealth from './components/SystemHealth';
import AdminQuickActions from './components/AdminQuickActions';

// Shared feedback from design system
import Toast from '../../components/common/Toast';

/**
 * AdminDashboard
 * Complete BuildSync Platform Admin Dashboard:
 * 1. Page Header ("Good Evening, Admin")
 * 2. Four KPI Cards (Total Users 1,248, Owners 86, Tenants 1,102, Properties 24)
 * 3. Support Tickets (#ST-1042, #ST-1038, #ST-1029, #ST-1011)
 * 4. Platform Activity Chart (Logins vs New Users over 7 days)
 * 5. Recent Messages (Owner & ticket inquiries)
 * 6. System Health (Database, Payment Gateway, Server Uptime, Backup)
 * 7. Quick Actions (Manage Users, View Support Tickets, System Settings, Generate Reports)
 */
export default function AdminDashboard() {
  const [toastMessage, setToastMessage] = useState(null);

  return (
    <div className="admin-dashboard">
      {/* 1. PAGE HEADER */}
      <AdminDashboardHeader />

      {/* 2. FOUR KPI CARDS */}
      <AdminSummaryCards />

      {/* MAIN CONTENT + RIGHT SIDE PANEL */}
      <div className="admin-dashboard__main-layout">
        {/* LEFT COLUMN: ACTIVITY CHART, TICKETS, QUICK ACTIONS */}
        <div className="admin-dashboard__content-area">
          {/* 4. PLATFORM ACTIVITY CHART */}
          <PlatformActivityChart />

          {/* 3. SUPPORT TICKETS */}
          <SupportTickets />

          {/* 7. QUICK ACTIONS */}
          <AdminQuickActions
            onActionClick={(actionTitle) => {
              setToastMessage(`Opening ${actionTitle}...`);
            }}
          />
        </div>

        {/* RIGHT COLUMN: RECENT MESSAGES & SYSTEM HEALTH */}
        <aside className="admin-dashboard__side-panel">
          {/* 5. RECENT MESSAGES */}
          <RecentMessages />

          {/* 6. SYSTEM HEALTH */}
          <SystemHealth />
        </aside>
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <Toast
          type="info"
          title="Admin Panel"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
