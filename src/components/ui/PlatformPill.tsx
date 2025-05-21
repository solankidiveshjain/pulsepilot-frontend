"use client";

import { CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { Instagram, Youtube } from "lucide-react";
import React from "react";

export interface PlatformPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  platform: CommentPlatform;
  count?: number;
  isSelected?: boolean;
}

export function PlatformPill({
  platform,
  count,
  isSelected = false,
  className,
  ...props
}: PlatformPillProps) {
  // Get the platform-specific icon
  const Icon = React.useMemo(() => {
    switch (platform) {
      case "youtube":
        return Youtube;
      case "instagram":
        return Instagram;
      default:
        return Youtube;
    }
  }, [platform]);

  // Get platform-specific color
  const iconColor = React.useMemo(() => {
    switch (platform) {
      case "youtube":
        return "text-red-500";
      case "instagram":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  }, [platform]);

  // Platform display name
  const platformName = React.useMemo(() => {
    switch (platform) {
      case "youtube":
        return "YouTube";
      case "instagram":
        return "Instagram";
      default:
        return platform;
    }
  }, [platform]);

  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-in-out",
        "bg-gray-100 text-gray-700 hover:bg-gray-200",
        "aria-selected:ring-offset-1 aria-selected:ring-2 aria-selected:ring-current",
        "focus-visible:ring-offset-1 focus:outline-none focus-visible:ring-2",
        className
      )}
      role="switch"
      aria-checked={isSelected}
      {...props}
    >
      <Icon className={cn("h-4 w-4", iconColor)} />
      {platformName}
      {count !== undefined && (
        <span className="ml-1 text-xs font-semibold text-gray-500">{count}</span>
      )}
    </button>
  );
}

export const PlatformPillGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>;
};
