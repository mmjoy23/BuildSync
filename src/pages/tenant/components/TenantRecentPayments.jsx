import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import { tenantRecentPayments } from '../../../data/tenantDashboardData';

/**
 * TenantRecentPayments
 * Table displaying past rent and billing transactions with StatusBadge and "View All" link.
 */
function TenantRecentPayments() {
  return (
    <Card
      title="Recent Payments"
      actions={
        <Link to="/tenant/bills" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th className="table th--right">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tenantRecentPayments.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: 500 }}>{row.date}</td>
                <td className="table td--right" style={{ fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                  {row.amount}
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TenantRecentPayments;
