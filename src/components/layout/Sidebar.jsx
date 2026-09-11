import React from 'react';
import NavItem from './NavItem';
import Avatar from '../common/Avatar';

/**
 * Sidebar component
 * Configurable with brand name, role, items, user profile section, and mobile responsive state.
 */
function Sidebar({
  brandName = 'BuildSync',
  role = 'Owner',
  items = [],
  user,
  footer,
  isOpen = false,
  onClose,
  className = '',
}) {
  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${className}`.trim()}
    >
      <div className="sidebar__brand">
        <span className="sidebar__brand-name">
          {brandName}
          <span className="sidebar__brand-dot">.</span>
        </span>
        {role && <span className="sidebar__role-badge">{role}</span>}
      </div>

      <nav className="sidebar__nav">
        {items.map((item, index) => {
          if (item.type === 'section') {
            return (
              <div key={index} className="sidebar__section-label">
                {item.label}
              </div>
            );
          }
          return (
            <NavItem
              key={item.to || index}
              to={item.to}
              label={item.label}
              icon={item.icon}
              iconName={item.iconName}
              badge={item.badge}
              onClick={onClose}
            />
          );
        })}
      </nav>

      {/* User / Profile section at bottom */}
      {user ? (
        <div className="sidebar__footer">
          <div className="sidebar__user-profile">
            <Avatar name={user.name} size="sm" color={user.avatarColor || 'blue'} />
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-role">{user.role || role}</span>
            </div>
          </div>
        </div>
      ) : footer ? (
        <div className="sidebar__footer">{footer}</div>
      ) : null}
    </aside>
  );
}

export default Sidebar;
