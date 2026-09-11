import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import { tenantComplaintsList } from '../../../data/tenantDashboardData';

/**
 * TenantComplaints
 * Displays tenant-specific complaints with status badges:
 * - #1023 | Lift not working | In Progress | 1 Sep
 * - #1018 | Water leakage | Resolved | 28 Aug
 */
function TenantComplaints() {
  return (
    <Card
      title="My Complaints"
      actions={
        <Link to="/tenant/maintenance" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tenantComplaintsList.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td className="table td--muted">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TenantComplaints;
