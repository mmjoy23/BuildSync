import React from 'react';
import StatCard from '../../../components/common/StatCard';
import { adminSummaryMetrics } from '../../../data/adminDashboardData';

/**
 * AdminSummaryCards
 * Four platform summary cards:
 *  - Total Users: 1,248 (+12%)
 *  - Owners: 86 (+5%)
 *  - Tenants: 1,102 (+15%)
 *  - Properties: 24 (+3%)
 */
function AdminSummaryCards() {
  const { totalUsers, owners, tenants, properties } = adminSummaryMetrics;

  return (
    <div className="admin-summary-grid">
      <StatCard
        title={totalUsers.title}
        value={totalUsers.value}
        trend={totalUsers.trend}
        trendDirection={totalUsers.trendDirection}
        iconName={totalUsers.iconName}
        iconColor={totalUsers.iconColor}
      />
      <StatCard
        title={owners.title}
        value={owners.value}
        trend={owners.trend}
        trendDirection={owners.trendDirection}
        iconName={owners.iconName}
        iconColor={owners.iconColor}
      />
      <StatCard
        title={tenants.title}
        value={tenants.value}
        trend={tenants.trend}
        trendDirection={tenants.trendDirection}
        iconName={tenants.iconName}
        iconColor={tenants.iconColor}
      />
      <StatCard
        title={properties.title}
        value={properties.value}
        trend={properties.trend}
        trendDirection={properties.trendDirection}
        iconName={properties.iconName}
        iconColor={properties.iconColor}
      />
    </div>
  );
}

export default AdminSummaryCards;
