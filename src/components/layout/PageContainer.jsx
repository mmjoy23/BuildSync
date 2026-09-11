import React from 'react';

/**
 * PageContainer component
 * Content wrapper providing standardized margins, widths, and padding.
 */
function PageContainer({ children, className = '', ...props }) {
  return (
    <div className={`page-container ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default PageContainer;
