import React from 'react';
import Icon from './Icon';

/**
 * Select component
 * Custom styled dropdown selector with standard select props.
 */
function Select({
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  placeholder,
  children,
  className = '',
  ...props
}) {
  return (
    <div className="select-wrapper">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`field-base ${error ? 'field-base--error' : ''} ${className}`.trim()}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <span className="select-chevron">
        <Icon name="chevron-down" size={16} />
      </span>
    </div>
  );
}

export default Select;
