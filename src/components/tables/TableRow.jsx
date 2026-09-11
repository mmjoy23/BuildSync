import React from 'react';

/**
 * TableRow component
 * Renders individual row with click handler and selected state.
 */
function TableRow({
  children,
  onClick,
  selected = false,
  className = '',
  ...props
}) {
  return (
    <tr
      onClick={onClick}
      className={`${selected ? 'selected' : ''} ${className}`.trim()}
      style={onClick ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {children}
    </tr>
  );
}

export default TableRow;
