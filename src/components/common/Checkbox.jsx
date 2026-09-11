import React from 'react';

/**
 * Checkbox component
 */
function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  id,
  className = '',
  ...props
}) {
  return (
    <label
      className={`checkbox-label ${disabled ? 'checkbox-label--disabled' : ''} ${className}`.trim()}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}

export default Checkbox;
