import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import Badge from '../../../components/common/Badge';
import { recentComplaints } from '../../../data/ownerDashboardData';

/**
 * RecentComplaints
 * Table displaying active tenant complaints with priority and status badges.
 */
function RecentComplaints() {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="red">{priority}</Badge>;
      case 'Medium':
        return <Badge variant="orange">{priority}</Badge>;
      default:
        return <Badge variant="gray">{priority}</Badge>;
    }
  };

  return (
    <Card
      title="Recent Complaints"
      actions={
        <Link to="/owner/maintenance" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
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
              <th>Flat</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{item.id}</td>
                <td>{item.description}</td>
                <td style={{ fontWeight: 600 }}>{item.flat}</td>
                <td>{getPriorityBadge(item.priority)}</td>
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

export default RecentComplaints;
