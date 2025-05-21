import { cn } from "@/lib/utils";
import React from "react";

/**
 * Skeleton component for loading states
 * Shows a placeholder UI while content is loading
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
      aria-hidden="true"
    />
  );
}
