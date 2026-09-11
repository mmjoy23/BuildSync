import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/common/StatusBadge';
import { supportTicketsList } from '../../../data/adminDashboardData';

/**
 * SupportTickets
 * Compact table showing platform support tickets:
 * - #ST-1042 | Payment issue | Open | 2h
 * - #ST-1038 | Login problem | In Progress | 5h
 * - #ST-1029 | Feature request | Pending | 1d
 * - #ST-1011 | Bug report | Resolved | 2d
 */
function SupportTickets() {
  return (
    <Card
      title="Support Tickets"
      actions={
        <Link to="/admin/support" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
    >
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Description</th>
              <th>Status</th>
              <th className="table th--right">Age</th>
            </tr>
          </thead>
          <tbody>
            {supportTicketsList.map((t) => (
              <tr key={t.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                  {t.id}
                </td>
                <td style={{ fontWeight: 500 }}>{t.description}</td>
                <td>
                  <StatusBadge status={t.status} />
                </td>
                <td className="table td--right table td--muted">{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default SupportTickets;
