import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Icon from '../../../components/common/Icon';
import { tenantNoticesList } from '../../../data/tenantDashboardData';

/**
 * TenantNotices
 * Displays building notices for the tenant:
 * - Water Supply Maintenance
 * - Building Cleaning Schedule
 * - Maintenance Work (Lift)
 */
function TenantNotices() {
  return (
    <Card
      title="Recent Notices"
      actions={
        <Link to="/tenant/notices" className="btn btn--ghost btn--xs" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          View All →
        </Link>
      }
    >
      <div className="notices-list">
        {tenantNoticesList.map((notice) => (
          <Link
            key={notice.id}
            to="/tenant/notices"
            className="notice-item"
          >
            <div className={`notice-item__icon notice-item__icon--${notice.iconColor}`}>
              <Icon name={notice.iconName} size={18} />
            </div>
            <div className="notice-item__content">
              <span className="notice-item__title">{notice.title}</span>
              <p className="notice-item__info">{notice.info}</p>
              <span className="notice-item__time">📅 {notice.time}</span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default TenantNotices;
