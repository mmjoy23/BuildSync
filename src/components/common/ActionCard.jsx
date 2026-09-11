import React from 'react';
import Button from './Button';
import Icon from './Icon';

/**
 * ActionCard component
 * Props:
 *  - title
 *  - description
 *  - icon (or iconName)
 *  - actionText
 *  - onAction
 *  - buttonVariant
 */
function ActionCard({
  title,
  description,
  icon,
  iconName,
  actionText = 'Open',
  onAction,
  buttonVariant = 'primary',
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`action-card ${className}`.trim()} {...props}>
      {(icon || iconName) && (
        <div className="action-card__icon">
          {icon ? icon : <Icon name={iconName} size={22} />}
        </div>
      )}
      <div>
        <h4 className="action-card__title">{title}</h4>
        {description && <p className="action-card__description">{description}</p>}
      </div>
      {children}
      {actionText && (
        <div className="action-card__footer">
          <Button variant={buttonVariant} size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ActionCard;
