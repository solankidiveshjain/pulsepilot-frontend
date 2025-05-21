"use client";

import { cn } from "@/lib/utils";
import { Clock, MessageCircle, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { CommentModel } from "../state/CommentModels";

export interface CommentCardProps {
  comment: CommentModel;
  isSelected?: boolean;
  onSelect?: () => void;
  onToggleThread?: () => void;
  onViewFullPost?: () => void;
  isExpanded?: boolean;
  repliesCount?: number;
}

// Helper function to get platform styles
function getPlatformStyles(platform: string): string {
  switch (platform.toLowerCase()) {
    case "youtube":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "instagram":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "twitter":
    case "x":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

// Helper function to format platform name
function formatPlatform(platform: string): string {
  switch (platform.toLowerCase()) {
    case "youtube":
      return "YouTube";
    case "instagram":
      return "Instagram";
    case "twitter":
    case "x":
      return "Twitter";
    default:
      return platform;
  }
}

/**
 * Optimized CommentCard component for use in virtualized lists.
 * Uses the domain model directly and implements proper memoization.
 */
export const CommentCard = memo(function CommentCard({
  comment,
  isSelected = false,
  onSelect,
  onToggleThread,
  onViewFullPost,
  isExpanded = false,
  repliesCount,
}: CommentCardProps) {
  // Use the relative time from the domain model
  const relativeTime = comment.formatRelativeTime();

  // Default replies count to the model value if not explicitly provided
  const replies = repliesCount ?? comment.repliesCount;

  return (
    <div
      className={cn(
        "relative rounded-lg border shadow-sm transition-all",
        isSelected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-border bg-card hover:bg-gray-50 dark:hover:bg-gray-800/10",
        comment.isFlagged && "border-l-4 border-l-red-500",
        !isSelected && !comment.isFlagged && "hover:shadow",
        !comment.isRead && "border-l-4 border-l-blue-500 dark:border-l-blue-400",
        comment.isArchived && "opacity-75"
      )}
      data-comment-id={comment.id}
    >
      {/* Selection checkbox */}
      {onSelect && (
        <div className="absolute left-3 top-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="p-4 pl-10">
        <div className="flex gap-3">
          {/* Author avatar */}
          <div className="flex-shrink-0">
            <Image
              src={comment.authorImage || "/images/default-avatar.png"}
              alt={comment.author}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Author name */}
                <h3 className="truncate text-sm font-medium">{comment.author}</h3>

                {/* Platform label */}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs font-medium",
                    getPlatformStyles(comment.platform)
                  )}
                >
                  {formatPlatform(comment.platform)}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{relativeTime}</span>
              </div>
            </div>

            {/* Comment text */}
            <div className="mt-1 whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
              {comment.content}
            </div>

            {/* Post link - only show if onViewFullPost is provided */}
            {onViewFullPost && (
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewFullPost();
                  }}
                  className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span className="max-w-[200px] truncate">View full post</span>
                </button>
              </div>
            )}

            {/* Engagement metrics */}
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{comment.likesCount}</span>
              </div>

              {/* Thread toggle */}
              {replies > 0 && onToggleThread && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleThread();
                  }}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{`${replies} ${replies === 1 ? "reply" : "replies"}`}</span>
                  <span className="ml-0.5">{isExpanded ? "(hide)" : "(show)"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
