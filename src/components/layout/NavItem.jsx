import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon';

/**
 * NavItem component
 * Supports NavLink pathing or custom click handlers, icons, active styling, and badges.
 */
function NavItem({
  to,
  label,
  icon,
  iconName,
  badge,
  badgeVariant = 'danger',
  onClick,
  active = false,
  className = '',
}) {
  const renderContent = () => (
    <>
      {(icon || iconName) && (
        <span className="nav-item__icon">
          {icon ? icon : <Icon name={iconName} size={18} />}
        </span>
      )}
      <span className="nav-item__label">{label}</span>
      {badge !== undefined && badge !== null && (
        <span className={`nav-item__badge ${badgeVariant ? `nav-item__badge--${badgeVariant}` : ''}`}>
          {badge}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `nav-item ${isActive ? 'active' : ''} ${className}`.trim()
        }
      >
        {renderContent()}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav-item ${active ? 'active' : ''} ${className}`.trim()}
      data-active={active}
    >
      {renderContent()}
    </button>
  );
}

export default NavItem;
