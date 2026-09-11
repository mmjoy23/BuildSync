import React from 'react';
import StatCard from '../../../components/common/StatCard';
import StatusBadge from '../../../components/common/StatusBadge';
import Icon from '../../../components/common/Icon';
import { tenantSummaryMetrics } from '../../../data/tenantDashboardData';

/**
 * TenantSummaryCards
 * Displays the four tenant summary cards:
 *  A. Current Bill (৳33,580, Due: 10 Sep 2025, Status: Unpaid) - Visually prominent
 *  B. Last Payment (৳28,500, Aug 2025, Status: Paid)
 *  C. Parking Slot (P-05, Status: Assigned)
 *  D. Maintenance Requests (1, Status: In Progress)
 */
function TenantSummaryCards({ onPayNow }) {
  const { currentBill, lastPayment, parkingSlot, maintenanceRequests } = tenantSummaryMetrics;

  return (
    <div className="tenant-summary-grid">
      {/* A. Current Bill - Prominent */}
      <div className="stat-card stat-card--prominent">
        <div className="stat-card__top">
          <div>
            <div className="stat-card__label" style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              {currentBill.title}
            </div>
            <div className="stat-card__value" style={{ color: 'var(--color-danger-dark)' }}>
              {currentBill.amount}
            </div>
          </div>
          <div className="stat-card__icon stat-card__icon--red">
            <Icon name={currentBill.iconName} size={22} />
          </div>
        </div>
        <div className="stat-card__footer" style={{ justifyContent: 'space-between' }}>
          <span className="stat-card__subtitle" style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
            Due: {currentBill.dueDate}
          </span>
          <StatusBadge status={currentBill.status} />
        </div>
      </div>

      {/* B. Last Payment */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div>
            <div className="stat-card__label">{lastPayment.title}</div>
            <div className="stat-card__value">{lastPayment.amount}</div>
          </div>
          <div className="stat-card__icon stat-card__icon--green">
            <Icon name={lastPayment.iconName} size={22} />
          </div>
        </div>
        <div className="stat-card__footer" style={{ justifyContent: 'space-between' }}>
          <span className="stat-card__subtitle">{lastPayment.period}</span>
          <StatusBadge status={lastPayment.status} />
        </div>
      </div>

      {/* C. Parking Slot */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div>
            <div className="stat-card__label">{parkingSlot.title}</div>
            <div className="stat-card__value" style={{ letterSpacing: '1px' }}>
              {parkingSlot.slot}
            </div>
          </div>
          <div className="stat-card__icon stat-card__icon--blue">
            <Icon name={parkingSlot.iconName} size={22} />
          </div>
        </div>
        <div className="stat-card__footer" style={{ justifyContent: 'flex-start' }}>
          <StatusBadge status={parkingSlot.status} />
        </div>
      </div>

      {/* D. Maintenance Requests */}
      <div className="stat-card">
        <div className="stat-card__top">
          <div>
            <div className="stat-card__label">{maintenanceRequests.title}</div>
            <div className="stat-card__value">{maintenanceRequests.count}</div>
          </div>
          <div className="stat-card__icon stat-card__icon--orange">
            <Icon name={maintenanceRequests.iconName} size={22} />
          </div>
        </div>
        <div className="stat-card__footer" style={{ justifyContent: 'flex-start' }}>
          <StatusBadge status={maintenanceRequests.status} />
        </div>
      </div>
    </div>
  );
}

export default TenantSummaryCards;
