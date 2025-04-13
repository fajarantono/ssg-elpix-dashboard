'use client';
import React, { useState, useEffect } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  register?: UseFormRegisterReturn;
}

const SwitchCustom: React.FC<SwitchProps> = ({
  label = '',
  defaultChecked = false,
  disabled = false,
  onChange,
  register,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Effect to update the checked state when defaultChecked changes
  useEffect(() => {
    setIsChecked(false);
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  // Define colors based on the checked state
  const switchColors = {
    background: isChecked ? 'bg-green-500' : 'bg-red-500', // Green for on, Red for off
    knob: isChecked ? 'translate-x-full bg-white' : 'translate-x-0 bg-white',
  };

  return (
    <label
      className={`flex flex-col items-center cursor-pointer select-none text-sm font-medium ${
        disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-400'
      }`}
      {...register}
      onClick={handleToggle} // Toggle when the label itself is clicked
    >
      <div className="relative mb-1">
        {' '}
        {/* Added margin for spacing */}
        <div
          className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
            disabled
              ? 'bg-gray-100 pointer-events-none dark:bg-gray-800'
              : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
        ></div>
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
};

export default SwitchCustom;
