"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { KeyboardEvent, memo } from "react";

export interface FilterChipProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  className?: string;
  count?: number;
  children?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

/**
 * A chip component for displaying and toggling filters.
 * Features include:
 * - Customizable appearance
 * - Optional count badge
 * - Optional close/remove button
 * - Accessible keyboard interactions
 */
export const FilterChip = memo(function FilterChip({
  label,
  isSelected = false,
  onClick,
  className,
  count,
  children,
  closable = false,
  onClose,
}: FilterChipProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    } else {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isSelected
          ? "bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25"
          : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/70",
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <span className="flex items-center">{children || label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "ml-2 rounded-full px-2 py-0.5 text-xs font-semibold",
            isSelected
              ? "bg-primary/20 text-primary dark:bg-primary/30"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          )}
        >
          {count}
        </span>
      )}
      {closable && (
        <button
          type="button"
          onClick={handleCloseClick}
          className="ml-1.5 flex items-center justify-center rounded-full p-0.5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus-visible:ring-2 dark:hover:bg-gray-700"
          aria-label={`Remove ${label} filter`}
        >
          <X size={14} className="text-gray-500 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
});
