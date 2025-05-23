"use client";
import React, { useEffect, useRef, useState } from "react";

export default function DropdownWithDivider() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
      >
        Options
        <svg
          className="duration-200 ease-in-out stroke-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.79199 7.396L10.0003 12.6043L15.2087 7.396"
            stroke=""
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 w-full min-w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-[#1E2635]">
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#"
                className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Edit
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Duplicate
              </a>
            </li>
            <li>
              <span className="my-1.5 block h-px w-full bg-gray-200 dark:bg-[#353C49]"></span>
            </li>
            <li>
              <a
                href="#"
                className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Archive
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Move
              </a>
            </li>
            <li>
              <span className="my-1.5 block h-px w-full bg-gray-200 dark:bg-[#353C49]"></span>
            </li>
            <li>
              <a
                href="#"
                className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Delete
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
