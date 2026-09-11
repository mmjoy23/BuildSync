import React from 'react';
import Icon from '../common/Icon';
import SearchBar from '../common/SearchBar';
import NotificationBell from '../common/NotificationBell';
import UserMenu from '../common/UserMenu';

/**
 * Navbar component
 * Supports menu toggle, search bar (customizable placeholder), notifications, and user dropdown menu.
 */
function Navbar({
  onMenuToggle,
  onSearch,
  searchValue,
  searchPlaceholder = 'Search anything...',
  notificationCount = 0,
  onNotificationClick,
  userName = 'Alex Morgan',
  userRole = 'Owner',
  userAvatarColor = 'blue',
  onUserAction,
  children,
  className = '',
}) {
  return (
    <header className={`navbar ${className}`.trim()}>
      {onMenuToggle && (
        <button
          type="button"
          className="navbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>
      )}

      {onSearch !== undefined ? (
        <SearchBar
          value={searchValue}
          onChange={onSearch}
          placeholder={searchPlaceholder}
        />
      ) : (
        <SearchBar
          placeholder={searchPlaceholder}
        />
      )}

      <div className="navbar__spacer" />

      <div className="navbar__right">
        {children}
        <NotificationBell
          count={notificationCount}
          onClick={onNotificationClick}
        />
        <UserMenu
          name={userName}
          role={userRole}
          onItemClick={onUserAction}
        />
      </div>
    </header>
  );
}

export default Navbar;
