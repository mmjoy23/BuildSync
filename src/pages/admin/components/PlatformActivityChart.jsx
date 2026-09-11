import React from 'react';
import Card from '../../../components/common/Card';
import { platformActivityData } from '../../../data/adminDashboardData';

/**
 * PlatformActivityChart
 * Graph comparing daily user Logins vs New Users over the last 7 days.
 */
function PlatformActivityChart() {
  const { period, days } = platformActivityData;
  const maxLogins = 1400; // Ceiling for normalization

  return (
    <Card
      title="Platform Activity"
      actions={
        <div className="activity-chart-header">
          <div className="activity-legend">
            <span className="activity-legend__dot activity-legend__dot--logins" />
            <span>Logins</span>
          </div>
          <div className="activity-legend">
            <span className="activity-legend__dot activity-legend__dot--new-users" />
            <span>New Users</span>
          </div>
        </div>
      }
    >
      <div className="bar-chart-container">
        <div className="activity-chart-bars">
          {days.map((item) => {
            const loginHeight = Math.round((item.logins / maxLogins) * 100);
            const userHeight = Math.min(Math.round(((item.newUsers * 16) / maxLogins) * 100), 100);

            return (
              <div key={item.day} className="activity-chart-group">
                <div className="activity-chart-pair">
                  <div
                    className="activity-bar-item activity-bar-item--logins"
                    style={{ height: `${loginHeight}%` }}
                    title={`${item.day} Logins: ${item.logins}`}
                  />
                  <div
                    className="activity-bar-item activity-bar-item--new-users"
                    style={{ height: `${userHeight}%` }}
                    title={`${item.day} New Users: ${item.newUsers}`}
                  />
                </div>
                <span className="activity-chart-day">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default PlatformActivityChart;
