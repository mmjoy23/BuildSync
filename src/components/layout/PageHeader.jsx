import React from 'react';

/**
 * PageHeader component
 * Standardized page title, description, and action button bar.
 */
function PageHeader({ title, description, actions, children, className = '' }) {
  return (
    <div className={`page-header ${className}`.trim()}>
      <div className="page-header__text">
        {title && <h1 className="page-header__title">{title}</h1>}
        {description && (
          <p className="page-header__description">{description}</p>
        )}
        {children}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}

export default PageHeader;
