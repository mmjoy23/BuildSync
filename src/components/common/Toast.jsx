import React from 'react';
import Icon from './Icon';

/**
 * Toast component
 * Props:
 *  - title: string
 *  - message: string
 *  - type: 'info' | 'success' | 'warning' | 'error'
 *  - onClose: func
 */
function Toast({ title, message, type = 'info', onClose, className = '' }) {
  const iconMap = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-circle',
    error: 'x-circle',
  };

  return (
    <div className={`toast ${className}`.trim()} role="status">
      <div className={`toast__icon toast__icon--${type}`}>
        <Icon name={iconMap[type] || 'info'} size={20} />
      </div>
      <div className="toast__content">
        {title && <div className="toast__title">{title}</div>}
        {message && <div className="toast__message">{message}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="toast__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

export default Toast;
