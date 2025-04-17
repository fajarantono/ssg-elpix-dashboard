'use client';

interface UploadModalProps {
  isOpen: boolean;
  filename?: string;
}

export default function UploadModal({ isOpen, filename }: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[300px] shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

        <p className="text-sm font-medium mb-2">
          <span className="text-blue-500">{filename}</span>
        </p>
        <div className="flex justify-center my-8">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-t-4 border-b-blue-500 border-b-4 border-l-blue-500 border-l-4 border-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-md text-gray-500">Please Wait...</p>
      </div>
    </div>
  );
}
