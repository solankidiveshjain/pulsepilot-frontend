"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CommentFilter } from "../models";

interface ContextBarProps {
  filters: CommentFilter;
  emotions?: string[];
  sentiments?: string[];
  categories?: string[];
  onClearFilters?: () => void;
}

export function ContextBar({
  filters,
  emotions = [],
  sentiments = [],
  categories = [],
  onClearFilters,
}: ContextBarProps) {
  // Format filter values for display
  const formatPlatform = (platform: string) => {
    const platforms: Record<string, string> = {
      youtube: "YouTube",
      instagram: "Instagram",
      twitter: "Twitter",
      facebook: "Facebook",
    };
    return platforms[platform] || platform;
  };

  const formatTimeRange = (timeRange: string) => {
    const ranges: Record<string, string> = {
      today: "Today",
      yesterday: "Yesterday",
      week: "Last 7 days",
      month: "Last 30 days",
      all: "All time",
    };
    return ranges[timeRange] || timeRange;
  };

  // Check if there are any active filters
  const hasActiveFilters =
    (filters.platform && filters.platform.length > 0) ||
    filters.timeRange ||
    filters.read === false ||
    filters.flagged === true ||
    filters.search ||
    emotions.length > 0 ||
    sentiments.length > 0 ||
    categories.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Platform filters */}
      {filters.platform &&
        filters.platform.map((platform) => (
          <Badge key={platform} variant="secondary" className="gap-1">
            {formatPlatform(platform)}
          </Badge>
        ))}

      {/* Time range filter */}
      {filters.timeRange && (
        <Badge variant="secondary" className="gap-1">
          {formatTimeRange(filters.timeRange)}
        </Badge>
      )}

      {/* Status filters */}
      {filters.read === false && <Badge variant="secondary">Unread</Badge>}
      {filters.flagged === true && <Badge variant="secondary">Flagged</Badge>}

      {/* Search term */}
      {filters.search && (
        <Badge variant="secondary" className="gap-1">
          Search: {filters.search}
        </Badge>
      )}

      {/* Emotion filters */}
      {emotions.map((emotion) => (
        <Badge key={emotion} variant="secondary" className="gap-1">
          {emotion}
        </Badge>
      ))}

      {/* Sentiment filters */}
      {sentiments.map((sentiment) => (
        <Badge key={sentiment} variant="secondary" className="gap-1">
          {sentiment}
        </Badge>
      ))}

      {/* Category filters */}
      {categories.map((category) => (
        <Badge key={category} variant="secondary" className="gap-1">
          {category}
        </Badge>
      ))}

      {/* Clear all button */}
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 rounded-full border border-gray-200 bg-transparent px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Clear all filters"
        >
          Clear all
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
