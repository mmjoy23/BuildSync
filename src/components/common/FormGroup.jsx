import React from 'react';

/**
 * FormGroup component
 * Wraps labels, input controls, error messages, and helper text.
 */
function FormGroup({
  label,
  required = false,
  error,
  helper,
  htmlFor,
  children,
  className = '',
}) {
  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`form-label ${required ? 'form-label--required' : ''}`}
        >
          {label}
        </label>
      )}
      {children}
      {error && <div className="form-error">⚠️ {error}</div>}
      {!error && helper && <div className="form-helper">{helper}</div>}
    </div>
  );
}

export default FormGroup;
