import React, { useState } from 'react';

const VideoExample: React.FC<{
  videoUrl?: string;
}> = ({ videoUrl }) => {
  const [loading, setLoading] = useState(true);

  if (!videoUrl) {
    return (
      <div className="w-full h-50 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-300 text-center">
        Video penjelasan tidak tersedia
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {loading && (
        <div className="inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded animate-pulse z-10">
          <div className="w-full h-50 bg-gray-300 dark:bg-gray-600 rounded-xl" />
        </div>
      )}
      <video
        src={`${process.env.NEXT_PUBLIC_API_URL}/video/${videoUrl}`}
        controls
        autoPlay
        className="w-full h-auto rounded"
        onCanPlayThrough={() => setLoading(false)}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );

};

export default VideoExample;
