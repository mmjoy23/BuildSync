import React from 'react';

/**
 * Card component
 * Options: header, footer, padded, hoverable, flat
 */
function Card({
  title,
  actions,
  header,
  footer,
  children,
  padded = true,
  hoverable = false,
  flat = false,
  className = '',
  ...props
}) {
  const padClass = padded ? 'card--padded' : '';
  const hoverClass = hoverable ? 'card--hoverable' : '';
  const flatClass = flat ? 'card--flat' : '';

  return (
    <div className={`card ${padClass} ${hoverClass} ${flatClass} ${className}`.trim()} {...props}>
      {(title || actions || header) && (
        <div className="card__header">
          {header ? (
            header
          ) : (
            <>
              <h3 className="card__title">{title}</h3>
              {actions && <div className="card__actions">{actions}</div>}
            </>
          )}
        </div>
      )}
      <div className={padded && (title || header) ? 'card__body' : ''}>
        {children}
      </div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

export default Card;
