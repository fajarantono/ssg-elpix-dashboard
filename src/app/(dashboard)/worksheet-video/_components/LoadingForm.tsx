import React from 'react';
import InputFormSkeleton from '@/components/form/input/InputFormSkeleton';

const LoadingForm: React.FC = () => {
  return (
    <div className="space-y-4 mt-4">
      {/* Skeleton Loading */}
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="text" width="w-full" />
      <InputFormSkeleton type="checkbox" />
      <InputFormSkeleton type="switch" />
      <InputFormSkeleton type="text" width="w-full" />
    </div>
  );
};

export default LoadingForm;
