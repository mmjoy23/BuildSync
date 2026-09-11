import React from 'react';

/**
 * TableHeader component
 * Renders table headers based on columns definition or custom children.
 */
function TableHeader({ columns = [], children }) {
  return (
    <thead>
      <tr>
        {columns.length > 0
          ? columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`table th ${col.align ? `table th--${col.align}` : ''}`}
                style={{ width: col.width }}
              >
                {col.title || col.label}
              </th>
            ))
          : children}
      </tr>
    </thead>
  );
}

export default TableHeader;
