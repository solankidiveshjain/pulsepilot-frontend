"use client";

import { CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import React from "react";

export interface ContextLabelProps {
  platforms?: CommentPlatform[];
  filters?: string[];
  sortedBy?: string;
  className?: string;
}

export function ContextLabel({
  platforms = [],
  filters = [],
  sortedBy,
  className,
}: ContextLabelProps) {
  const hasPlatforms = platforms.length > 0;
  const hasFilters = filters.length > 0;
  const hasSortedBy = !!sortedBy;

  // Only show if we have at least one filter active
  if (!hasPlatforms && !hasFilters && !hasSortedBy) {
    return null;
  }

  return (
    <div className={cn("py-2 text-sm text-gray-500", className)}>
      <span className="font-medium">Showing: </span>

      {hasPlatforms ? (
        <span className="text-gray-700">
          {platforms.map((p, i) => {
            const displayName =
              p === "youtube" ? "YouTube" : p === "instagram" ? "Instagram" : "Twitter";
            return (
              <React.Fragment key={p}>
                {displayName}
                {i < platforms.length - 1 ? ", " : ""}
              </React.Fragment>
            );
          })}
        </span>
      ) : (
        <span>All Platforms</span>
      )}

      {hasFilters && (
        <>
          <span className="mx-1">•</span>
          <span className="font-medium">Filtered: </span>
          <span className="text-gray-700">
            {filters.map((f, i) => (
              <React.Fragment key={f}>
                {f}
                {i < filters.length - 1 ? ", " : ""}
              </React.Fragment>
            ))}
          </span>
        </>
      )}

      {hasSortedBy && (
        <>
          <span className="mx-1">•</span>
          <span className="font-medium">Sorted: </span>
          <span className="text-gray-700">{sortedBy}</span>
        </>
      )}
    </div>
  );
}
