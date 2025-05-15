"use client";

import { useOnClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export type SortOption = {
  label: string;
  value: string;
};

export interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SortDropdown({ options, value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  if (!options.length) {
    return null;
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5",
          "text-sm font-medium text-gray-700 shadow-sm transition-all",
          "focus-visible:ring-offset-1 hover:bg-gray-50 focus:outline-none focus-visible:ring-2",
          "focus-visible:ring-gray-400"
        )}
        id="sort-menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Sort: {selectedOption?.label || "Default"}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="ring-opacity-5 absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="sort-menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm",
                  option.value === value
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
