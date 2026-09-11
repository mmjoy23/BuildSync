import React from 'react';

/**
 * Breadcrumb component
 * Props:
 *  - items: Array of { label: string, href?: string, to?: string }
 */
function Breadcrumb({ items = [], separator = '/', className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumb ${className}`.trim()}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div
            key={index}
            className={`breadcrumb__item ${isLast ? 'breadcrumb__item--current' : ''}`}
          >
            {isLast || (!item.href && !item.to) ? (
              <span>{item.label}</span>
            ) : (
              <a href={item.href || item.to} className="breadcrumb__link">
                {item.label}
              </a>
            )}
            {!isLast && <span className="breadcrumb__separator">{separator}</span>}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
