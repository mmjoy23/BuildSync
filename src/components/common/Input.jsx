import React from 'react';

/**
 * Input component
 * Supports prefix/suffix icons, states, error styling, and standard input props.
 */
function Input({
  type = 'text',
  prefix,
  suffix,
  error,
  disabled = false,
  className = '',
  id,
  name,
  value,
  onChange,
  placeholder,
  ...props
}) {
  const isWrapperNeeded = Boolean(prefix || suffix);
  const baseField = (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`field-base ${error ? 'field-base--error' : ''} ${className}`.trim()}
      {...props}
    />
  );

  if (!isWrapperNeeded) {
    return baseField;
  }

  const wrapperClasses = [
    'input-wrapper',
    prefix ? 'input-wrapper--prefix' : '',
    suffix ? 'input-wrapper--suffix' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {prefix && <span className="input-prefix">{prefix}</span>}
      {baseField}
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  );
}

export default Input;
