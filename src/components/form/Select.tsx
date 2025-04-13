import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  value = '',
  disabled = false,
  success = false,
  error = false,
  hint,
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Select Input */}
        <select
          id={id}
          className={`h-11 w-full appearance-none rounded-lg border px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:outline-none focus:ring 
            ${
              error
                ? 'border-red-500 focus:ring-red-300'
                : success
                ? 'border-green-500 focus:ring-green-300'
                : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10'
            }
            dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:ring-brand-800
            ${
              value
                ? 'text-gray-800 dark:text-white/90'
                : 'text-gray-400 dark:text-gray-400'
            }
            ${className}`}
          value={value}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          onChange={(e) => onChange && onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="text-gray-500 dark:text-gray-400"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 0 1 1.414 0L10 11l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {/* Hint/Error Text */}
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? 'text-red-500'
              : success
              ? 'text-green-500'
              : 'text-gray-500'
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Select;
