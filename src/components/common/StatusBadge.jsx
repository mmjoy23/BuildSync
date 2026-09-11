import React from 'react';

/**
 * StatusBadge component
 * Normalizes common statuses and renders standard design tokens:
 * - Paid, Pending, Unpaid, Overdue
 * - Open, Assigned, In Progress, Resolved
 * - Vacant, Occupied, Maintenance, Cancelled, Active, Inactive
 */
function StatusBadge({ status = '', withDot = true, className = '', ...props }) {
  const normalized = String(status).toLowerCase().trim().replace(/\s+/g, '-');
  const dotClass = withDot ? 'badge--dot' : '';

  return (
    <span
      className={`badge status-badge--${normalized} ${dotClass} ${className}`.trim()}
      {...props}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
