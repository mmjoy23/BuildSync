import React from 'react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { systemHealthMetrics } from '../../../data/adminDashboardData';

/**
 * SystemHealth
 * Displays mock platform infrastructure telemetry:
 * - Database: Online
 * - Payment Gateway: Online
 * - Server Uptime: 99.9%
 * - Backup: Last backup 2 Sep 2025
 */
function SystemHealth() {
  return (
    <Card title="System Health">
      <div className="system-health-list">
        {systemHealthMetrics.map((item) => (
          <div key={item.id} className="system-health-row">
            <div className="system-health-info">
              <span className="system-health-name">{item.name}</span>
              <span className="system-health-detail">{item.info}</span>
            </div>
            <Badge variant={item.variant === 'success' ? 'green' : 'blue'} withDot>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default SystemHealth;
