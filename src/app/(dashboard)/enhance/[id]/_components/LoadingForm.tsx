import { ClockIcon, FilmIcon, ScanIcon } from 'lucide-react';
import React from 'react';

const LoadingForm: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded-xl flex gap-4">
      <div className="flex-shrink-0 w-64 h-40 bg-gray-200 rounded-lg overflow-hidden">
        <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="flex-grow">
        <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>

        <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>

        <div className="space-y-2 text-gray-600">
          <div className="flex items-center mb-4">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400 animate-pulse" />
            <div className="w-1/5 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ms-1"></div>
          </div>

          <div className="flex items-center mb-4">
            <FilmIcon className="w-4 h-4 mr-2 text-gray-400 animate-pulse" />
            <div className="w-1/6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ms-1"></div>
          </div>

          <div className="flex items-center">
            <ScanIcon className="w-4 h-4 mr-2 text-gray-400 animate-pulse" />
            <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ms-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingForm;
