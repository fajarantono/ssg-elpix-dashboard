import React from 'react';

const LoadingForm: React.FC = () => {
  return (
    <div className="mx-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-xl flex">
      <div className="flex-shrink-0 w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="w-full h-150 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingForm;
