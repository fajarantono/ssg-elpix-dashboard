import ComponentCard from '@/components/common/ComponentCard';
import TableSkeleton from '@/components/tables/TableSkeleton';
import React from 'react';

const LoadingDashboard: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div className="flex-shrink-0 w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex-shrink-0 w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex-shrink-0 w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex-shrink-0 w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex-shrink-0 w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className='className="border rounded-md dark:border-gray-700"'>
          <div className="h-120 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse m-8"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <ComponentCard>
          <TableSkeleton columns={5} rows={10} />
        </ComponentCard>
        <ComponentCard>
          <TableSkeleton columns={5} rows={10} />
        </ComponentCard>
      </div>
    </div>
  );
};

export default LoadingDashboard;
