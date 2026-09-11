import React from 'react';
import Icon from './Icon';

/**
 * SearchBar component
 */
function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  return (
    <div className={`search-bar ${className}`.trim()}>
      <span className="search-bar__icon">
        <Icon name="search" size={16} />
      </span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-bar__input"
        {...props}
      />
    </div>
  );
}

export default SearchBar;
