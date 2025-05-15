import React from 'react';

const LoadingChart: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className='className="border rounded-md dark:border-gray-700"'>
        <div className="h-120 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse m-8"></div>
      </div>
    </div>
  );
};

export default LoadingChart;
