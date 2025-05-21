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
  Eye,
  Flag,
  Maximize2,
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
  onViewFullPost?: (postId: string, commentId: string) => void;
  repliesCount?: number;
}

// Memoize the component to prevent unnecessary re-renders
export const CommentCard = memo(function CommentCard({
  comment,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onToggleThread,
  onViewFullPost,
  repliesCount = 0,
}: CommentCardProps) {
  const { postPreview } = usePostPreview(comment.postId);
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    if (onSelect) onSelect(comment.commentId);
  };

  const handleViewFullPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewFullPost) onViewFullPost(comment.postId, comment.commentId);
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
        "relative rounded-lg border shadow-sm transition-all",
        isSelected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-border bg-card hover:bg-gray-50 dark:hover:bg-gray-800/10",
        comment.flagged && "border-l-4 border-l-red-500",
        !isSelected && !comment.flagged && "hover:shadow",
        !comment.read && "border-l-4 border-l-blue-500 dark:border-l-blue-400",
        comment.archived && "opacity-75"
      )}
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-comment-id={comment.commentId}
      data-is-expanded={isExpanded}
    >
      {/* Selection checkbox - only visible when in selection mode or selected */}
      {onSelect && (
        <div className="absolute left-3 top-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      )}

      <div className={cn("flex gap-2 p-3", onSelect && "pl-8")}>
        {/* Author avatar - 36x36px for more compact design */}
        <div className="flex-shrink-0">
          <Image
            src={comment.author.profileImageUrl || "/images/default-avatar.png"}
            alt={comment.author.name}
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Author name */}
              <h3 className="truncate text-sm font-medium">{comment.author.name}</h3>

              {/* Platform pill */}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-medium",
                  getPlatformStyles()
                )}
              >
                {getPlatformName()}
              </span>

              {/* Attention indicator */}
              {comment.requiresAttention && (
                <span className="flex-shrink-0">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                </span>
              )}
            </div>

            {/* Kebab menu - only show on hover */}
            {isHovered && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full p-1 transition-colors hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
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

          {/* Comment text - clamped to 2 lines */}
          <p className="mt-1 line-clamp-2 text-sm">{comment.text}</p>

          {/* Post context - only shown if postPreview is available */}
          {postPreview && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/30 p-1 text-xs">
              <span className="line-clamp-1 text-muted-foreground">
                Re: {postPreview.title || "Post from " + getPlatformName()}
              </span>
              <button
                onClick={handleViewFullPost}
                className="ml-auto flex-shrink-0 rounded p-0.5 text-primary hover:bg-primary/10"
                aria-label="View full post"
              >
                <Maximize2 className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Metrics row - aligned horizontally */}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {/* Post date */}
            <span>{formattedDate}</span>

            {/* Like count */}
            {comment.likes > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {comment.likes}
              </span>
            )}

            {/* Reply count with thread toggle */}
            {repliesCount > 0 && onToggleThread && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleThread(comment.commentId);
                }}
                className="flex items-center gap-1 rounded hover:text-foreground focus:outline-none"
              >
                <MessageSquare className="h-3 w-3" />
                <span>{repliesCount} replies</span>
              </button>
            )}

            {/* View post button */}
            {onViewFullPost && !postPreview && (
              <button
                onClick={handleViewFullPost}
                className="ml-auto flex items-center gap-1 rounded hover:text-foreground focus:outline-none"
              >
                <Eye className="h-3 w-3" />
                <span>View post</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies section - only visible when expanded */}
      {isExpanded && repliesCount > 0 && (
        <div className="border-t border-border bg-card/50 px-3 py-2">
          <ReplyThread
            commentId={comment.commentId}
            repliesCount={repliesCount}
            isExpanded={isExpanded}
          />
        </div>
      )}
    </div>
  );
});
