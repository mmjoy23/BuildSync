import React from 'react';
import Button from './Button';
import Icon from './Icon';

/**
 * ErrorState component
 * Displays an error icon, heading, details, and optional retry action.
 */
function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  retryLabel = 'Try Again',
  onRetry,
  className = '',
}) {
  return (
    <div className={`error-state ${className}`.trim()}>
      <div className="error-state__icon">
        <Icon name="alert-circle" size={32} />
      </div>
      <h4 className="error-state__title">{title}</h4>
      {message && <p className="error-state__message">{message}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
