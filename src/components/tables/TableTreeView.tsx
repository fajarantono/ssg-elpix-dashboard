import React, { useState } from 'react';
import { Table, TableBody, TableHeader, TableRow } from '../ui/table';
import { CircleChevronDown, CircleChevronRight, CircleDotDashed } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Column<T> {
  title: string;
  key: keyof T;
  inlineSize?: number;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
}

interface TreeNode<T> {
  id: string;
  parentId?: string | null;
  children?: T[];
}

interface Variant {
  striped?: boolean;
  bordered?: boolean;
  sm?: boolean;
  hover?: boolean;
}

interface TableTreeViewProps<T extends TreeNode<T>> {
  columns: Column<T>[];
  data: T[];
  variant?: Variant;
}

export default function TableTreeView<T extends TreeNode<T>>({
  columns,
  data,
  variant = {},
}: TableTreeViewProps<T>) {
  //const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
    Object.fromEntries(data.map((row) => [row.id, true])),
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const rowClasses = `transition-colors ${
    variant.striped
      ? 'odd:bg-gray-50 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-900'
      : ''
  } ${variant.hover ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`;


  const renderChildRows = (children: T[], level: number) => {
    return children.map((child) => (
      <React.Fragment key={child.id}>
        <TableRow className={`border-b ${rowClasses}`}>
          {columns.map((column, index) => (
            <td
              key={column.key as string}
              className={`p-${
                variant.sm ? '2' : '3'
              } align-middle text-gray-600 dark:text-white/90 font-normal`}
              style={{
                inlineSize: column.inlineSize,
                textAlign: column.align,
                paddingLeft: index === 0 ? `${level * 40}px` : undefined,
              }}
            >
              {index === 0 ? (
                <li>
                  {column.render
                    ? column.render(child)
                    : (child[column.key] as React.ReactNode)}
                </li>
              ) : column.render ? (
                column.render(child)
              ) : (
                (child[column.key] as React.ReactNode)
              )}
            </td>
          ))}
        </TableRow>
        {expandedRows[child.id] &&
          child.children &&
          renderChildRows(child.children, level + 1)}
      </React.Fragment>
    ));
  };

  const renderTopLevelRows = (rows: T[]) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <TableRow className={`border-b ${rowClasses}`}>
          {columns.map((column, index) => (
            <td
              key={column.key as string}
              className={`p-${
                variant.sm ? '2' : '3'
              } align-middle font-medium text-gray-600 text-theme-sm dark:text-white/90`}
              style={{
                inlineSize: column.inlineSize,
                textAlign: column.align,
                paddingLeft: index === 0 ? '15px' : undefined,
              }}
            >
              {index === 0 ? (
                <div className="flex items-center gap-2">
                  {row.children && row.children.length > 0 ? (
                    <button
                      onClick={() => toggleRow(row.id)}
                      className="focus:outline-none"
                    >
                      {expandedRows[row.id] ? (
                        <CircleChevronDown size={16} className="text-green-400"/>
                      ) : (
                        <CircleChevronRight size={16} className="text-green-400"/>
                      )}
                    </button>
                  ) : (
                    <CircleDotDashed size={16} className="text-red-400" />
                  )}
                  <span>{column.render ? column.render(row) : (row[column.key] as React.ReactNode)}</span>
                </div>
              ) : (
                column.render ? column.render(row) : (row[column.key] as React.ReactNode)
              )}
            </td>
          ))}
        </TableRow>
        {expandedRows[row.id] &&
          row.children &&
          renderChildRows(row.children, 1)}
      </React.Fragment>
    ));
  };

  return (
    <div
      className={twMerge(
        variant.bordered
          ? 'mb-4'
          : 'mb-4 rounded-md border dark:border-gray-700',
      )}
    >
      <div className="relative w-full overflow-auto">
        <Table className="w-full caption-bottom text-sm">
          <TableHeader className="[&_tr]:border-b">
            <TableRow className="border-b transition-colors bg-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className="h-10 px-3 align-middle font-medium"
                  style={{
                    inlineSize: column.inlineSize,
                    textAlign: column.align,
                  }}
                >
                  {column.title}
                </th>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-0">
            {data.length === 0 ? (
              <TableRow>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No data available
                </td>
              </TableRow>
            ) : (
              renderTopLevelRows(data)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
