import React from 'react';

interface SkeletonInputProps {
  columns?: number;
  rows?: number;
}

const SkeletonInput: React.FC<SkeletonInputProps> = ({
  columns = 1,
  rows = 5,
}) => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {/* Header */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            inlineSize: '15%',
          }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="h-5 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex gap-4"
            style={{
              inlineSize: '100%',
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-11 bg-gray-200 rounded-md"
                style={{ inlineSize: '100%' }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonInput;
