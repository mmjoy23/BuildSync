import React from 'react';

/**
 * LoadingState component
 * Displays a spinner and message.
 */
function LoadingState({ label = 'Loading...', size = 'md', className = '' }) {
  return (
    <div className={`loading-state ${className}`.trim()}>
      <div className={`spinner spinner--${size}`} />
      {label && <span className="loading-state__label">{label}</span>}
    </div>
  );
}

export default LoadingState;
