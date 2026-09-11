import React, { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import Icon from './Icon';

/**
 * UserMenu component
 * Supports displaying current user's profile info and dropdown actions.
 */
function UserMenu({
  name = 'User',
  role = 'Owner',
  email = '',
  avatarSrc,
  menuItems = [],
  onItemClick,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultItems = [
    { label: 'Profile Settings', icon: 'settings', action: 'settings' },
    { label: 'Logout', icon: 'log-out', action: 'logout', danger: true },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultItems;

  return (
    <div className={`user-menu ${className}`.trim()} ref={menuRef}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <Avatar name={name} src={avatarSrc} size="sm" />
        <span className="user-menu__name">{name}</span>
        <span className="user-menu__chevron">
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {isOpen && (
        <div className="user-menu__dropdown">
          <div className="user-menu__header">
            <Avatar name={name} src={avatarSrc} size="md" />
            <div className="user-menu__info">
              <span className="user-menu__full-name">{name}</span>
              <span className="user-menu__role">{role}</span>
            </div>
          </div>
          <div className="user-menu__items">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.divider && <div className="user-menu__divider" />}
                <button
                  type="button"
                  className={`user-menu__item ${item.danger ? 'user-menu__item--danger' : ''}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.onClick) item.onClick();
                    if (onItemClick) onItemClick(item.action || item.label);
                  }}
                >
                  {item.icon && <Icon name={item.icon} size={16} />}
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
