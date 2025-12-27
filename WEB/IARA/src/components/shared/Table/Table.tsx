/**
 * Table Component
 * Reusable data table with sorting and pagination
 */

import React from 'react';
import { Button } from '../Button';
import './Table.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  // Pagination
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  actions,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  onPageSizeChange,
}: TableProps<T>) {
  const totalPages = total ? Math.ceil(total / pageSize) : 1;
  const showPagination = total && total > pageSize;

  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key];
  };

  const handlePrevious = () => {
    if (page > 1 && onPageChange) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages && onPageChange) {
      onPageChange(page + 1);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(e.target.value));
    }
  };

  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="table-header-cell"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
              {actions && <th className="table-header-cell">Actions</th>}
            </tr>
          </thead>
          <tbody className="table-body">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="table-empty"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={onRowClick ? 'table-row-clickable' : ''}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {actions && (
                    <td className="table-cell table-cell-actions">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="table-pagination">
          <div className="table-pagination-info">
            <span>
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, total)} of {total} results
            </span>
            <div className="table-pagination-size">
              <label htmlFor="page-size">Rows per page:</label>
              <select
                id="page-size"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="table-pagination-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="table-pagination-controls">
            <Button
              size="small"
              variant="secondary"
              onClick={handlePrevious}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="table-pagination-pages">
              Page {page} of {totalPages}
            </span>
            <Button
              size="small"
              variant="secondary"
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
