import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextareaProps {
  id?: string; // Unique identifier for accessibility
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  register?: UseFormRegisterReturn;
}

const TextArea: React.FC<TextareaProps> = ({
  id,
  placeholder = 'Enter your message',
  rows = 3,
  value,
  onChange,
  className = '',
  disabled = false,
  error = false,
  hint = '',
  register,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const textareaClasses = [
    'w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none',
    className,
    disabled
      ? 'bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
      : error
      ? 'bg-transparent text-gray-600 border-gray-300 focus:border-error-300 focus:ring focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800'
      : 'bg-transparent text-gray-600 border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative">
      <textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
        {...(register ? register : { value, onChange: handleChange })}
        disabled={disabled}
        className={textareaClasses}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p
          id={`${id}-hint`}
          className={`mt-1.5 text-xs ${
            error ? 'text-error-500' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
