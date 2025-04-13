import React from 'react';
import { Table, TableBody, TableHeader, TableRow } from '../ui/table';
import { twMerge } from 'tailwind-merge';

interface Column<T> {
  title: string;
  key: keyof T;
  inlineSize?: number;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface BasicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  variant?: {
    striped?: boolean;
    bordered?: boolean;
    sm?: boolean;
    hover?: boolean;
  };
}

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  style?: React.CSSProperties;
  colSpan?: number;
}

const CustomTableCell: React.FC<TableCellProps> = ({
  children,
  isHeader,
  className,
  style,
  colSpan,
}) => {
  const Tag = isHeader ? 'th' : 'td';
  return (
    <Tag className={className} style={style} colSpan={colSpan}>
      {children}
    </Tag>
  );
};

export default function BasicTable<T>({
  columns,
  data,
  variant = {},
}: BasicTableProps<T>) {
  return (
    <div
      className={twMerge(
        variant.bordered
          ? 'mb-4'
          : 'mb-4 rounded-md border dark:border-gray-700',
      )}
    >
      <div className="relative w-full overflow-auto">
        <Table
          className={twMerge(
            'w-full caption-bottom text-sm',
            variant.bordered &&
              'border border-gray-300 dark:border-gray-600 border-collapse',
            variant.sm && 'text-xs',
          )}
        >
          {/* Table Header */}
          <TableHeader className="[&_tr]:border-b">
            <TableRow className="border-b bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              {columns.map((column) => (
                <CustomTableCell
                  key={column.key as string}
                  isHeader
                  className="h-10 px-3 text-left align-middle font-medium"
                  style={{
                    inlineSize: column.inlineSize,
                    textAlign: column.align,
                  }}
                >
                  {column.title}
                </CustomTableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="[&_tr:last-child]:border-0">
            {data.length === 0 ? (
              <TableRow>
                <CustomTableCell
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No data available
                </CustomTableCell>
              </TableRow>
            ) : (
              data.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={twMerge(
                    'transition-colors',
                    variant.hover && 'hover:bg-gray-50 dark:hover:bg-gray-700',
                    variant.striped && rowIndex % 2 !== 0
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : '',
                    variant.bordered ? '' : 'border-b',
                  )}
                >
                  {columns.map((column) => (
                    <CustomTableCell
                      key={column.key as string}
                      className={twMerge(
                        'px-4 py-2 text-gray-500 text-start align-middle dark:text-gray-400',
                        variant.bordered &&
                          'border border-gray-300 dark:border-gray-600',
                        variant.sm && 'py-2 px-3',
                      )}
                      style={{
                        inlineSize: column.inlineSize,
                        textAlign: column.align,
                      }}
                    >
                      {column.render
                        ? column.render(item)
                        : (item[column.key] as React.ReactNode)}
                    </CustomTableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
