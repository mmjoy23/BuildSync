import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/common/Icon';
import { quickActionsList } from '../../../data/ownerDashboardData';

/**
 * QuickActions
 * Four compact action cards: Generate Bills, Add Tenant, Record Expense, View Reports.
 */
function QuickActions({ onActionClick }) {
  return (
    <div className="quick-actions-section">
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
        Quick Actions
      </div>
      <div className="quick-actions-grid">
        {quickActionsList.map((action) => (
          <Link
            key={action.id}
            to={action.route}
            className="quick-action-card"
            onClick={(e) => {
              if (onActionClick) {
                onActionClick(action.title);
              }
            }}
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

export default QuickActions;
