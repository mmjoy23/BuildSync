import React from 'react';
import Icon from './Icon';

/**
 * StatCard component
 * Props:
 *  - title (or label)
 *  - value
 *  - subtitle
 *  - icon (or iconName)
 *  - iconColor: 'blue' | 'green' | 'orange' | 'purple' | 'red'
 *  - trend: e.g. "12%", "+4"
 *  - trendDirection: 'up' | 'down' | 'flat'
 */
function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconName,
  iconColor = 'blue',
  trend,
  trendDirection = 'up',
  className = '',
  ...props
}) {
  return (
    <div className={`stat-card ${className}`.trim()} {...props}>
      <div className="stat-card__top">
        <div>
          <div className="stat-card__label">{title}</div>
          <div className="stat-card__value">{value}</div>
        </div>
        {(icon || iconName) && (
          <div className={`stat-card__icon stat-card__icon--${iconColor}`}>
            {icon ? icon : <Icon name={iconName} size={22} />}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="stat-card__footer">
          {trend && (
            <span className={`stat-card__trend stat-card__trend--${trendDirection}`}>
              <Icon
                name={trendDirection === 'down' ? 'trending-down' : 'trending-up'}
                size={14}
              />
              {trend}
            </span>
          )}
          {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
