import React from 'react';

/**
 * Toggle (switch) component
 */
function Toggle({
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
      className={`toggle-label ${disabled ? 'toggle-label--disabled' : ''} ${className}`.trim()}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="toggle-input"
        {...props}
      />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

export default Toggle;
