import React from 'react';

/**
 * ProgressBar component
 * Supports sizes: sm, md, lg
 * Colors: primary, green, orange, red, purple
 */
function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'primary',
  className = '',
}) {
  const percent = Math.min(Math.max(0, Math.round((value / max) * 100)), 100);

  return (
    <div className={`progress-bar ${className}`.trim()}>
      {(label || showValue) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {showValue && <span className="progress-bar__value">{percent}%</span>}
        </div>
      )}
      <div className={`progress-bar__track progress-bar__track--${size}`}>
        <div
          className={`progress-bar__fill progress-bar__fill--${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
