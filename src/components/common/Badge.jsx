import React from 'react';

/**
 * Generic Badge component
 * Variants: blue, green, red, orange, yellow, purple, gray
 * Supports withDot indicator
 */
function Badge({
  children,
  variant = 'blue',
  withDot = false,
  className = '',
  ...props
}) {
  const dotClass = withDot ? 'badge--dot' : '';
  return (
    <span className={`badge badge--${variant} ${dotClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}

export default Badge;
