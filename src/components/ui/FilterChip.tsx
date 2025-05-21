"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  children: React.ReactNode;
}

export function FilterChip({ isSelected = false, children, className, ...props }: FilterChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-in-out",
        "border border-gray-300",
        "text-gray-600 hover:border-gray-500 hover:bg-gray-100 hover:text-gray-900",
        "aria-selected:border-gray-900 aria-selected:bg-gray-900 aria-selected:text-white",
        "focus-visible:ring-offset-1 ring-gray-400 focus:outline-none focus-visible:ring-2",
        className
      )}
      role="switch"
      aria-checked={isSelected}
      {...props}
    >
      {children}
    </button>
  );
}

export const FilterChipGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "scrollbar-hidden sticky top-16 z-10 flex flex-wrap gap-2 overflow-x-auto border-b border-gray-200 bg-white py-2",
        "md:flex-nowrap md:py-3",
        className
      )}
      role="radiogroup"
    >
      {children}
    </div>
  );
};
