import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostPreview } from "@/hooks/use-comments";
import { Comment } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Archive,
  Check,
  Flag,
  MessageSquare,
  MoreVertical,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";
import { ReplyThread } from "./ReplyThread";

export type CommentPlatform = "youtube" | "instagram" | "twitter";

export interface CommentCardProps {
  comment: Comment;
  isSelected?: boolean;
  isExpanded?: boolean;
  onSelect?: (id: string) => void;
  onReply?: (id: string) => void;
  onToggleThread?: (id: string) => void;
  repliesCount?: number;
}

const PostPreviewFallback = ({ platform }: { platform: string }) => (
  <div className="flex h-[56px] w-[56px] items-center justify-center rounded bg-muted text-muted-foreground">
    {platform === "youtube" ? "▶️" : platform === "instagram" ? "📷" : "🐦"}
  </div>
);

// Memoize the component to prevent unnecessary re-renders
export const CommentCard = memo(function CommentCard({
  comment,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onReply,
  onToggleThread,
  repliesCount = 0,
}: CommentCardProps) {
  const { postPreview, isLoading } = usePostPreview(comment.postId);
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    if (onSelect) onSelect(comment.commentId);
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReply) onReply(comment.commentId);
  };

  // Format the date for display
  const formattedDate = formatDistanceToNow(new Date(comment.postedAt), { addSuffix: true });

  // Platform-specific colors based on Figma spec
  const getPlatformStyles = () => {
    switch (comment.platform) {
      case "youtube":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "instagram":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "twitter":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Platform display name
  const getPlatformName = () => {
    switch (comment.platform) {
      case "youtube":
        return "YouTube";
      case "instagram":
        return "Instagram";
      case "twitter":
        return "X";
      default:
        return comment.platform;
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-sm transition-colors",
        isSelected && "border-primary/30 bg-primary/5 shadow-md",
        comment.flagged && "border-l-4 border-l-red-500",
        !isSelected && !comment.flagged && "border-border bg-card shadow hover:bg-card/80",
        !comment.read && "border-l-4 border-l-blue-500 dark:border-l-blue-400",
        comment.archived && "opacity-70"
      )}
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-comment-id={comment.commentId}
      data-is-expanded={isExpanded}
    >
      {/* Selection checkbox - only visible when in selection mode or selected */}
      {onSelect && (
        <div className="absolute left-4 top-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>
      )}

      <div className={cn("flex gap-3", onSelect && "pl-6")}>
        {/* Author avatar - 40x40px as per Figma spec */}
        <div className="flex-shrink-0">
          <Image
            src={comment.author.profileImageUrl || "/images/default-avatar.png"}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Author name */}
              <h3 className="truncate text-base font-medium text-[#111827] dark:text-[#F9FAFB]">
                {comment.author.name}
              </h3>

              {/* Platform pill */}
              <span
                className={cn("rounded-full px-2 py-0.5 text-xs font-medium", getPlatformStyles())}
              >
                {getPlatformName()}
              </span>

              {/* Attention indicator */}
              {comment.requiresAttention && (
                <span className="flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                </span>
              )}
            </div>

            {/* Kebab menu - only show on hover */}
            {isHovered && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Open comment actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Mark as Read
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag className="mr-2 h-4 w-4 text-red-500" />
                    Flag
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4 text-blue-500" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Comment content - max 3 lines unless expanded */}
          <p
            className={cn(
              "mt-2 text-sm text-[#374151] dark:text-[#9CA3AF]",
              !isExpanded && "line-clamp-3"
            )}
          >
            {comment.text}
          </p>

          {/* Reply button below comment text */}
          {onReply && (
            <button
              className="mt-2 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={handleReply}
            >
              <span>↩️ Reply</span>
            </button>
          )}

          {/* Post preview if available - lazy loaded */}
          {postPreview ? (
            <div className="mt-3 flex items-center gap-2 rounded bg-muted/50 p-2">
              {postPreview.thumbnailUrl ? (
                <Image
                  src={postPreview.thumbnailUrl}
                  alt={postPreview.title}
                  width={56}
                  height={56}
                  className="rounded object-cover"
                />
              ) : (
                <PostPreviewFallback platform={comment.platform} />
              )}
              <span className="line-clamp-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                {postPreview.title || postPreview.caption}
              </span>
            </div>
          ) : isLoading ? (
            <div className="mt-3 flex h-14 animate-pulse items-center gap-2 rounded bg-muted/50 p-2">
              <div className="h-14 w-14 rounded bg-muted-foreground/20"></div>
              <div className="h-3 w-2/3 rounded bg-muted-foreground/20"></div>
            </div>
          ) : null}

          {/* Engagement stats and replies info */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {comment.likes}
              </span>
              {repliesCount > 0 && (
                <button
                  className="flex items-center gap-1 rounded px-1 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleThread) {
                      onToggleThread(comment.commentId);
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-controls={`replies-${comment.commentId}`}
                  aria-label={
                    isExpanded ? `Hide replies (${repliesCount})` : `Show replies (${repliesCount})`
                  }
                >
                  <MessageSquare className="h-3 w-3" />
                  {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
                </button>
              )}
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Replies shown directly in the document flow */}
          {isExpanded && repliesCount > 0 && (
            <div
              id={`replies-${comment.commentId}`}
              className="relative mt-4 border-t border-border/30 pb-2 pt-3 before:absolute before:left-[20px] before:top-0 before:h-[2px] before:w-[30px] before:bg-border/30"
              aria-live="polite"
            >
              <ReplyThread
                commentId={comment.commentId}
                repliesCount={repliesCount}
                isExpanded={isExpanded}
              />
            </div>
          )}
        </div>
      </div>

      {/* Flagged indicator */}
      {comment.flagged && (
        <div className="absolute right-4 top-4">
          <Flag className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  );
});
