import React, { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, required=false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',
        className,
      )}
    >
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default Label;
