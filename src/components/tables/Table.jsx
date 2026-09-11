import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import EmptyState from '../common/EmptyState';
import LoadingState from '../common/LoadingState';

/**
 * Table component
 * Props:
 *  - columns: Array of { key, label, render?, align?, width? }
 *  - data: Array of objects
 *  - title: string
 *  - actions: ReactNode
 *  - loading: boolean
 *  - emptyText: string
 *  - onRowClick: func
 *  - footer: ReactNode
 */
function Table({
  columns = [],
  data = [],
  title,
  actions,
  loading = false,
  emptyText = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  onRowClick,
  footer,
  children,
  className = '',
}) {
  return (
    <div className={`table-container ${className}`.trim()}>
      {(title || actions) && (
        <div className="table-toolbar">
          {title && <h3 className="table-toolbar__title">{title}</h3>}
          {actions && <div className="table-toolbar__actions">{actions}</div>}
        </div>
      )}

      <div className="table-scroll">
        <table className="table">
          {columns.length > 0 && <TableHeader columns={columns} />}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length || 1}>
                  <LoadingState label="Loading data..." />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIdx) => (
                <TableRow
                  key={row.id || rowIdx}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={col.align ? `table td--${col.align}` : ''}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </TableRow>
              ))
            ) : (
              !children && (
                <tr>
                  <td colSpan={columns.length || 1}>
                    <EmptyState title={emptyText} description={emptyDescription} />
                  </td>
                </tr>
              )
            )}
            {children}
          </tbody>
        </table>
      </div>

      {footer && <div className="table-footer">{footer}</div>}
    </div>
  );
}

export { TableHeader, TableRow };
export default Table;
