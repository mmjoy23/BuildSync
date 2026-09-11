import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/common/Icon';
import { adminQuickActions } from '../../../data/adminDashboardData';

/**
 * AdminQuickActions
 * Actions: Manage Users, View Support Tickets, System Settings, Generate Reports.
 */
function AdminQuickActions({ onActionClick }) {
  return (
    <div className="quick-actions-section">
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
        Quick Actions
      </div>
      <div className="quick-actions-grid">
        {adminQuickActions.map((action) => (
          <Link
            key={action.id}
            to={action.route}
            className="quick-action-card"
            onClick={() => onActionClick && onActionClick(action.title)}
          >
            <div className="quick-action-card__icon">
              <Icon name={action.iconName} size={18} />
            </div>
            <span className="quick-action-card__title">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminQuickActions;
