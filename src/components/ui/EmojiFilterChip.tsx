"use client";

import { cn } from "@/lib/utils";
import React from "react";

export type FilterCategory = "emotion" | "sentiment" | "category";

export interface EmojiFilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emoji: string;
  label: string;
  count?: number;
  isSelected?: boolean;
  category?: FilterCategory;
}

export function EmojiFilterChip({
  emoji,
  label,
  count,
  isSelected = false,
  category,
  className,
  ...props
}: EmojiFilterChipProps) {
  // Get category-specific styles
  const getCategoryStyles = () => {
    if (isSelected) {
      switch (category) {
        case "emotion":
          return "bg-blue-100 border-blue-400 text-blue-800";
        case "sentiment":
          return "bg-green-100 border-green-400 text-green-800";
        case "category":
          return "bg-purple-100 border-purple-400 text-purple-800";
        default:
          return "bg-primary/10 border-primary/30 text-primary";
      }
    }

    switch (category) {
      case "emotion":
        return "hover:bg-blue-50 hover:border-blue-300";
      case "sentiment":
        return "hover:bg-green-50 hover:border-green-300";
      case "category":
        return "hover:bg-purple-50 hover:border-purple-300";
      default:
        return "hover:bg-gray-100";
    }
  };

  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-in-out",
        "border border-gray-300",
        "text-gray-600 hover:border-gray-500 hover:bg-gray-100 hover:text-gray-900",
        getCategoryStyles(),
        "focus-visible:ring-offset-1 ring-gray-400 focus:outline-none focus-visible:ring-2",
        className
      )}
      aria-selected={isSelected}
      role="checkbox"
      aria-checked={isSelected}
      {...props}
    >
      <span className="mr-0.5 text-base" aria-hidden="true">
        {emoji}
      </span>
      {label}
      {count !== undefined && (
        <span
          className={cn("ml-1 text-xs font-semibold", isSelected ? "opacity-80" : "text-gray-500")}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export const EmojiFilterGroup = ({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <h3 className="text-sm font-medium text-gray-700">{label}</h3>}
      <div
        className={cn(
          "flex flex-wrap gap-2",
          "scrollbar-hidden overflow-x-auto py-1", // Mobile scrolling
          className
        )}
        role="group"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
};
