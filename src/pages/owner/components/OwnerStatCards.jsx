import React from 'react';
import StatCard from '../../../components/common/StatCard';
import ProgressBar from '../../../components/common/ProgressBar';
import { kpiMetrics } from '../../../data/ownerDashboardData';

/**
 * OwnerStatCards
 * Displays 5 KPI cards:
 *  A. Total Properties (3, +1 this year)
 *  B. Total Units (76, 68 Occupied, 8 Vacant, 89% progress)
 *  C. Monthly Expected Income (৳1,850,000, +12% vs last month)
 *  D. Collected This Month (৳1,650,000, 89% of expected)
 *  E. Outstanding (৳200,000, 12% of expected)
 */
function OwnerStatCards() {
  const { totalProperties, totalUnits, monthlyExpectedIncome, collectedThisMonth, outstanding } = kpiMetrics;

  return (
    <div className="owner-kpi-grid">
      {/* 1. Total Properties */}
      <StatCard
        title={totalProperties.title}
        value={totalProperties.value}
        iconName={totalProperties.iconName}
        iconColor={totalProperties.iconColor}
        trend={totalProperties.trend}
        trendDirection={totalProperties.trendDirection}
      />

      {/* 2. Total Units with Occupancy Progress */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div>
            <div className="stat-card__label">{totalUnits.title}</div>
            <div className="stat-card__value">{totalUnits.value}</div>
          </div>
          <div className="stat-card__icon stat-card__icon--purple">
            <span style={{ fontSize: '18px' }}>🏢</span>
          </div>
        </div>
        <div className="stat-card__footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
          <div className="kpi-unit-details">
            <span>
              <span className="kpi-unit-dot kpi-unit-dot--occupied" />
              {totalUnits.occupied} Occupied
            </span>
            <span>
              <span className="kpi-unit-dot kpi-unit-dot--vacant" />
              {totalUnits.vacant} Vacant
            </span>
          </div>
          <ProgressBar value={totalUnits.occupancyRate} size="sm" color="purple" />
        </div>
      </div>

      {/* 3. Monthly Expected Income */}
      <StatCard
        title={monthlyExpectedIncome.title}
        value={monthlyExpectedIncome.value}
        iconName={monthlyExpectedIncome.iconName}
        iconColor={monthlyExpectedIncome.iconColor}
        trend={monthlyExpectedIncome.trend}
        trendDirection={monthlyExpectedIncome.trendDirection}
      />

      {/* 4. Collected This Month */}
      <StatCard
        title={collectedThisMonth.title}
        value={collectedThisMonth.value}
        subtitle={collectedThisMonth.subtitle}
        iconName={collectedThisMonth.iconName}
        iconColor={collectedThisMonth.iconColor}
      />

      {/* 5. Outstanding */}
      <StatCard
        title={outstanding.title}
        value={outstanding.value}
        subtitle={outstanding.subtitle}
        iconName={outstanding.iconName}
        iconColor={outstanding.iconColor}
      />
    </div>
  );
}

export default OwnerStatCards;
