"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Comment } from "../models";

export interface CommentCardProps {
  comment: Comment;
  isSelected: boolean;
  isExpanded?: boolean;
  onSelect: () => void;
  onToggleThread?: () => void;
  onViewFullPost?: () => void;
  onHeightChange?: (height: number) => void;
  hasMeasured?: boolean;
}

export function CommentCard({
  comment,
  isSelected,
  isExpanded = false,
  onSelect,
  onToggleThread,
  onViewFullPost,
  onHeightChange,
  hasMeasured = false,
}: CommentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const hasReplies = (comment.children?.length || 0) > 0 || (comment.replies || 0) > 0;

  // Track element height for virtualization
  useEffect(() => {
    if (cardRef.current && onHeightChange && !hasMeasured) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          onHeightChange(entry.contentRect.height);
        }
      });
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [onHeightChange, hasMeasured]);

  // Format the date for display
  const formattedDate = useCallback(() => {
    try {
      return formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true });
    } catch (e) {
      return comment.timestamp || "Unknown date";
    }
  }, [comment.timestamp]);

  // Content preview logic
  const isLongContent = comment.content.length > 250;
  const displayContent = showFullContent
    ? comment.content
    : isLongContent
      ? `${comment.content.slice(0, 250)}...`
      : comment.content;

  return (
    <div
      ref={cardRef}
      className={`w-full rounded-lg border ${
        isSelected ? "border-primary bg-primary/5" : "border-border"
      } p-4 shadow-sm transition-colors`}
    >
      {/* Comment header with author info */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {comment.author?.avatarUrl ? (
              <Image
                src={comment.author.avatarUrl}
                alt={`${comment.author.name}'s profile`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {comment.author?.name?.charAt(0) || "?"}
              </div>
            )}
            {comment.author?.isVerified && (
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-blue-500 text-xs text-white">
                ✓
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="font-medium">{comment.author?.name || "Unknown user"}</h3>
              {comment.platform && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {comment.platform}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formattedDate()}</span>
              {!comment.isRead && (
                <Badge variant="default" className="h-5 rounded-full px-1.5 text-[10px]">
                  New
                </Badge>
              )}
              {comment.isFlagged && (
                <Badge variant="destructive" className="h-5 rounded-full px-1.5 text-[10px]">
                  Flagged
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label className="relative flex h-5 w-5 cursor-pointer items-center rounded">
            <input
              type="checkbox"
              className="peer absolute opacity-0"
              checked={isSelected}
              onChange={onSelect}
              aria-label={`Select comment by ${comment.author?.name || "Unknown user"}`}
            />
            <span className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-transparent transition-colors peer-checked:border-primary peer-checked:bg-primary dark:border-gray-600" />
            <span className="absolute left-0 right-0 top-0 hidden text-[10px] text-white peer-checked:block">
              ✓
            </span>
          </label>
          <button
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comment content */}
      <div className="mb-3">
        <p className="whitespace-pre-wrap break-words text-sm">{displayContent}</p>
        {isLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="mt-1 text-xs font-medium text-primary hover:underline"
          >
            {showFullContent ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Comment metadata and actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{comment.likes || 0}</span>
          </div>
          {comment.sentiment && (
            <div className="flex items-center gap-1">
              {comment.sentiment === "positive" && <Heart className="h-3.5 w-3.5 text-pink-500" />}
              {comment.sentiment === "negative" && <Flag className="h-3.5 w-3.5 text-red-500" />}
              {comment.sentiment === "neutral" && (
                <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
              )}
              <span className="capitalize">{comment.sentiment}</span>
            </div>
          )}
          {hasReplies && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{comment.replies || comment.children?.length || 0} replies</span>
            </div>
          )}
        </div>

        <div className="flex items-center">
          {onViewFullPost && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-xs"
              onClick={onViewFullPost}
            >
              <Share2 className="mr-1 h-3 w-3" />
              View Post
            </Button>
          )}
          {hasReplies && onToggleThread && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-7 rounded-full px-2 text-xs"
              onClick={onToggleThread}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Hide Replies
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  Show Replies
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Render child comments if thread is expanded */}
      {isExpanded && comment.children && comment.children.length > 0 && (
        <div className="mt-3 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
          {comment.children.map((reply) => (
            <div key={reply.commentId} className="mt-2 rounded-md border p-3">
              <div className="flex items-center">
                <div className="relative h-6 w-6 overflow-hidden rounded-full">
                  {reply.author?.avatarUrl ? (
                    <Image
                      src={reply.author.avatarUrl}
                      alt={`${reply.author.name}'s profile`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {reply.author?.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <div className="flex items-center">
                    <h4 className="text-xs font-medium">{reply.author?.name || "Unknown user"}</h4>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
