import React, { useState } from 'react';
import Icon from './Icon';
import IconButton from './IconButton';

/**
 * Alert component
 * Variants: info, success, warning, danger
 */
function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onClose,
  className = '',
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const iconMap = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-circle',
    danger: 'x-circle',
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`alert alert--${variant} ${className}`.trim()} role="alert">
      <div className="alert__icon">
        <Icon name={iconMap[variant] || 'info'} size={18} />
      </div>
      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="alert__close"
          onClick={handleClose}
          aria-label="Dismiss alert"
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

export default Alert;
