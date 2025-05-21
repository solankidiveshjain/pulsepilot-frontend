"use client";

import { CommentFilters, CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { memo } from "react";

interface ContextBarProps {
  filters: CommentFilters;
  onClearFilters: () => void;
  className?: string;
  // Add these extra filter types even if they're not in the official CommentFilters type yet
  sentiments?: string[];
  emotions?: string[];
  categories?: string[];
}

export const ContextBar = memo(function ContextBar({
  filters,
  onClearFilters,
  className,
  sentiments = [],
  emotions = [],
  categories = [],
}: ContextBarProps) {
  // Convert platform array to platform names
  const getPlatformNames = (platforms?: CommentPlatform[]) => {
    if (!platforms || platforms.length === 0) return null;

    const names = platforms.map((platform) => {
      switch (platform) {
        case "youtube":
          return "YouTube";
        case "instagram":
          return "Instagram";
        case "twitter":
          return "X";
        default:
          return platform;
      }
    });

    return names.join(", ");
  };

  // Check if any filter is active, including our custom filters
  const hasActiveFilters =
    Object.values(filters).some(
      (value) => value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== false)
    ) ||
    sentiments.length > 0 ||
    emotions.length > 0 ||
    categories.length > 0;

  // No need to render if no filters are active
  if (!hasActiveFilters) {
    return null;
  }

  // Get emoji for each emotion
  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case "anger":
        return "😡";
      case "joy":
        return "😂";
      case "sadness":
        return "😢";
      case "fear":
        return "😱";
      case "surprise":
        return "😲";
      case "love":
        return "❤️";
      case "disgust":
        return "🤢";
      case "neutral":
        return "😐";
      default:
        return "";
    }
  };

  // Get emoji for each sentiment
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "👍";
      case "negative":
        return "👎";
      case "neutral":
        return "😐";
      case "mixed":
        return "🤷";
      default:
        return "";
    }
  };

  // Get emoji for each category
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "spam":
        return "📦";
      case "product-feedback":
        return "🧪";
      case "praise":
        return "👏";
      case "complaint":
        return "⚠️";
      case "question":
        return "❓";
      case "feature-request":
        return "💡";
      case "irrelevant":
        return "🚫";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-1.5 rounded-md border bg-white/95 p-2 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-1.5">
        {/* Platform filter indicators */}
        {filters.platform && filters.platform.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {getPlatformNames(filters.platform)}
          </span>
        )}

        {/* Boolean filter indicators */}
        {filters.unread && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Unread
          </span>
        )}

        {filters.flagged && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Flagged
          </span>
        )}

        {filters.requiresAttention && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            Requires Attention
          </span>
        )}

        {filters.archived && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Archived
          </span>
        )}

        {/* Search filter indicator */}
        {filters.search && (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <span className="max-w-[150px] truncate">Search: {filters.search}</span>
          </span>
        )}

        {/* Emotion filters */}
        {emotions.map((emotion) => (
          <span
            key={emotion}
            className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
          >
            {getEmotionEmoji(emotion)} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          </span>
        ))}

        {/* Sentiment filters */}
        {sentiments.map((sentiment) => (
          <span
            key={sentiment}
            className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
          >
            {getSentimentEmoji(sentiment)} {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </span>
        ))}

        {/* Category filters */}
        {categories.map((category) => (
          <span
            key={category}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            {getCategoryEmoji(category)}{" "}
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        ))}
      </div>

      <button
        onClick={onClearFilters}
        className="group inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Clear all filters"
      >
        <X className="h-3.5 w-3.5 text-gray-500 group-hover:text-red-500" />
        <span className="group-hover:text-red-500">Clear</span>
      </button>
    </div>
  );
});
