import React from 'react';

/**
 * Button component supporting primary, secondary, danger, ghost, outline, success variants.
 * Sizes: xs, sm, md, lg.
 * Supports loading state with spinner, leading/trailing icons, full width.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconRight,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const fullClass = fullWidth ? 'btn--full' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${fullClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn__spinner" />
      ) : (
        icon && <span className="btn__icon">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && iconRight && <span className="btn__icon-right">{iconRight}</span>}
    </button>
  );
}

export default Button;
