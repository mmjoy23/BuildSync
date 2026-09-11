import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import { recentPayments } from '../../../data/ownerDashboardData';

/**
 * RecentPayments
 * Table displaying recent tenant payments with status badges and "View All" header action.
 */
function RecentPayments() {
  return (
    <Card
      title="Recent Payments"
      actions={
        <Link to="/owner/billing" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Flat</th>
              <th>Tenant</th>
              <th className="table th--right">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map((item) => (
              <tr key={item.id}>
                <td className="table td--muted">{item.date}</td>
                <td style={{ fontWeight: 600 }}>{item.flat}</td>
                <td>{item.tenant}</td>
                <td className="table td--right" style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                  {item.amount}
                </td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default RecentPayments;
