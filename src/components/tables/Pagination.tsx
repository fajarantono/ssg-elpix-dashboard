import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onShowSizeChange: (size: number) => void;
  showTotal?: (total: number, range: [number, number]) => string;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onShowSizeChange,
  showTotal,
}) => {
  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + Math.max(currentPage - 1, 1),
  ).filter((page) => page <= totalPages);

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
        {showTotal && (
          <span>Showing {showTotal(total, [startItem, endItem])}</span>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-normal text-gray-600 dark:text-gray-400">Rows per page</p>
          <select
            value={pageSize}
            onChange={(e) => onShowSizeChange(Number(e.target.value))}
            className="appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-1.5 pr-6 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:dark:text-gray-400 dark:placeholder:text-white/30 dark:focus:border-brand-800 h-8 w-[70px]"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center h-9 justify-center rounded-lg border border-gray-300 bg-white px-2 py-3.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentPage > 3 && <span className="px-2">...</span>}
            {pagesAroundCurrent.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-2 py-3.5 rounded ${
                  currentPage === page
                    ? 'bg-brand-500 text-white'
                    : 'bg-blue-500/[0.08] text-gray-700 dark:text-gray-400'
                } flex w-10 items-center justify-center h-9 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
              >
                {page}
              </button>
            ))}
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2 py-3.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-9 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
