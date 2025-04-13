import React from 'react';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 3,
  rows = 5,
}) => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Search Input & Add Button Skeleton */}
      {/* <div className="flex justify-between items-center">
        <div className="w-full h-10 xl:w-[300px] mr-2 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
        <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div> */}

      {/* Table Skeleton */}
      <div className="border rounded-md dark:border-gray-700">
        {/* Header */}
        <div
          className="grid border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-3"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={`header-${i}`}
              className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md"
              style={{ inlineSize: '90%' }}
            ></div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid border-b dark:border-gray-700 p-3"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                style={{ inlineSize: colIndex === 0 ? '75%' : '90%' }}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center">
        {/* Prev Button */}
        <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>

        {/* Page Numbers */}
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`page-${index}`} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>

        {/* Next Button */}
        <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    </div>
  );
};

export default TableSkeleton;
