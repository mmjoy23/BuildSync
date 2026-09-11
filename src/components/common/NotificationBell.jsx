import React from 'react';
import Icon from './Icon';

/**
 * NotificationBell component
 * Props:
 *  - count: number
 *  - onClick: func
 */
function NotificationBell({ count = 0, onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`notification-bell ${className}`.trim()}
      onClick={onClick}
      aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
    >
      <Icon name="bell" size={18} />
      {count > 0 && (
        <span className="notification-bell__badge">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
