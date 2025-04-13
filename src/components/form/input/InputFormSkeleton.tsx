import React from 'react';

interface InputFormSkeletonProps {
  type?: 'text' | 'textarea' | 'select' | 'checkbox' | 'switch';
  width?: string; // Lebar custom, misalnya 'w-1/2' atau 'w-full'
  height?: string; // Tinggi custom untuk textarea atau select
  rounded?: string; // Bentuk rounded untuk gaya tertentu
}

const InputFormSkeleton: React.FC<InputFormSkeletonProps> = ({
  type = 'text',
  width = 'w-full',
  height = 'h-10',
  rounded = 'rounded-md',
}) => {
  const baseClasses = `bg-gray-200 dark:bg-gray-700 animate-pulse ${rounded} ${width}`;

  return (
    <div className="space-y-2">
      {/* Label Skeleton */}
      <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Input Skeleton */}
      {type === 'text' && <div className={`${baseClasses} ${height}`}></div>}

      {type === 'textarea' && <div className={`${baseClasses} h-24`}></div>}

      {type === 'select' && (
        <div className={`${baseClasses} h-10`}>
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mx-auto mt-3"></div>
        </div>
      )}

      {type === 'checkbox' && (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )}

      {type === 'switch' && (
        <div className="flex items-center gap-2">
          <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative">
            <div className="w-4 h-4 bg-gray-400 dark:bg-gray-500 rounded-full absolute top-0.5 left-1 animate-pulse"></div>
          </div>
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )}
    </div>
  );
};

export default InputFormSkeleton;
