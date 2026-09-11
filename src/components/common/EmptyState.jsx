import React from 'react';
import Button from './Button';
import Icon from './Icon';

/**
 * EmptyState component
 * For tables, lists, cards with no records yet.
 */
function EmptyState({
  title = 'No data found',
  description = 'There are currently no items to display.',
  icon,
  iconName = 'clipboard-list',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <div className="empty-state__icon">
        {icon ? icon : <Icon name={iconName} size={28} />}
      </div>
      <h4 className="empty-state__title">{title}</h4>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && (
        <div className="empty-state__action">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
