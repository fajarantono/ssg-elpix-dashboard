import { Sparkles, Trash2 } from 'lucide-react';
import React from 'react';

const LoadingForm: React.FC = () => {
  return (
    <div className="w-full mx-auto p-2 bg-gray-100 rounded-xl flex flex-col">
      <div className="w-full mx-auto pt-4 ps-4 pe-4 bg-gray-100 rounded-xl flex gap-4">
        <div className="flex-shrink-0 w-54 h-36 bg-gray-200 rounded-lg overflow-hidden">
          <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="flex-grow mt-5">
          <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="w-2/3 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>

          <div className="space-y-2 flex flex-row text-gray-600">
            <div className="flex items-center mb-4 me-3">
              <Sparkles className="w-4 h-4 mr-2 text-gray-400 animate-pulse" />
              <div className="w-30 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ms-1"></div>
            </div>

            <div className="flex items-center mb-4">
              <Sparkles className="w-4 h-4 mr-2 text-gray-400 animate-pulse" />
              <div className="w-30 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ms-1"></div>
            </div>
          </div>
        </div>
        <div className="flex w-10 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2 items-center justify-center">
          <Trash2 className="w-4 h-4 text-gray-400 animate-pulse" />
        </div>
      </div>
      <div className="w-full mx-auto p-4 bg-gray-100 rounded-xl flex gap-4">
        <div className="flex-grow">
          <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>

          <div className="w-1/3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingForm;
