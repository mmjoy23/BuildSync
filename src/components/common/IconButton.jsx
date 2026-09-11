import React from 'react';

/**
 * IconButton component
 * Sizes: xs, sm, md, lg.
 * Variants: ghost, secondary, danger, primary.
 */
function IconButton({
  icon,
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  title = '',
  'aria-label': ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      className={`icon-btn icon-btn--${variant} icon-btn--${size} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      {...props}
    >
      {icon || children}
    </button>
  );
}

export default IconButton;
