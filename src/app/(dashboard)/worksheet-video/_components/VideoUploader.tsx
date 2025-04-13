import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import { FolderInputIcon } from 'lucide-react';
import { useState } from 'react';

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <ComponentCard>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Upload Video
      </h3>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-[#7aa6ff] rounded-xl px-10 pt-16 pb-10 flex flex-col items-center justify-center text-center bg-white"
      >
        <div className="bg-gray-200 mb-4 p-3 rounded-2xl">
          <FolderInputIcon size={40} className="text-gray-400" />
        </div>

        <p className="text-gray-500 text-sm">
          Drag and drop or{' '}
          <label className="text-blue-500 cursor-pointer text-bold font-bold">
            Browse
            <Input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </p>

        <p className="text-xs text-gray-400 mt-1">Support all image format</p>

        <p className="text-xs text-gray-300 mt-5">
          Your images are safely stored and secured using military grade
          encryption
        </p>
      </div>
    </ComponentCard>
  );
}
