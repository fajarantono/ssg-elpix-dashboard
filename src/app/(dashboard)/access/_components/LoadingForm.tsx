import React from 'react';
import InputFormSkeleton from '@/components/form/input/InputFormSkeleton';

const LoadingForm: React.FC = () => {
  return (
    <div className="space-y-4 mt-4">
      {/* Skeleton Loading */}
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="textarea" width="w-full" height="h-24" />
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="checkbox" />
      <InputFormSkeleton type="switch" />
    </div>
  );
};

export default LoadingForm;
