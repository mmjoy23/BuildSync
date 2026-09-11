import React from 'react';

/**
 * Textarea component
 * Auto-styled multiline text input.
 */
function Textarea({
  value,
  onChange,
  disabled = false,
  error,
  rows = 4,
  placeholder,
  className = '',
  ...props
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      placeholder={placeholder}
      className={`textarea ${error ? 'textarea--error' : ''} ${className}`.trim()}
      {...props}
    />
  );
}

export default Textarea;
