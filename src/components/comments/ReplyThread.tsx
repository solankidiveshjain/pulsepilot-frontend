import { useCommentThread } from "@/hooks/use-comments";
import { Reply } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { memo, useRef } from "react";

export interface ReplyThreadProps {
  commentId: string;
  repliesCount: number;
  isExpanded: boolean;
  onReplyToComment?: (commentId: string) => void;
  className?: string;
}

// Memoized individual reply component
const CommentReply = memo(({ reply }: { reply: Reply }) => {
  const formattedDate = formatDistanceToNow(new Date(reply.postedAt), { addSuffix: true });

  return (
    <div
      className="flex gap-3 rounded p-3 transition-colors focus-within:ring-1 focus-within:ring-primary hover:bg-muted/30"
      tabIndex={0}
    >
      <div className="flex-shrink-0">
        <Image
          src={reply.author.profileImageUrl || "/images/default-avatar.png"}
          alt={reply.author.name}
          width={28}
          height={28}
          className="rounded-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{reply.author.name}</span>
          {reply.author.platform && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-medium",
                reply.author.platform === "youtube" &&
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                reply.author.platform === "instagram" &&
                  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                reply.author.platform === "twitter" &&
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              )}
            >
              {reply.author.platform.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/90">{reply.text}</p>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
    </div>
  );
});

CommentReply.displayName = "CommentReply";

export const ReplyThread = memo(function ReplyThread({
  commentId,
  repliesCount,
  isExpanded,
  onReplyToComment,
  className,
}: ReplyThreadProps) {
  // Only fetch thread data when expanded
  const { thread, isLoading } = useCommentThread(commentId, isExpanded);
  const repliesContainerRef = useRef<HTMLDivElement>(null);

  // Skip rendering if no replies or not expanded
  if (!isExpanded || repliesCount === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Replies */}
      <div
        ref={repliesContainerRef}
        className="mt-2 rounded-md border-l-2 border-border bg-card/20 pl-4 pt-1"
        role="log"
        aria-busy={isLoading}
        aria-label={`${repliesCount} ${repliesCount === 1 ? "reply" : "replies"} to comment`}
      >
        {/* Simplified connector - just use left border and custom styling */}
        <div className="absolute -left-[1px] bottom-0 top-0 w-[2px] bg-border"></div>

        <div
          className="max-h-[200px] space-y-2 overflow-y-auto py-2"
          aria-label="Comment replies"
          role="list"
        >
          {isLoading
            ? // Loading skeleton
              Array.from({ length: Math.min(3, repliesCount) }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse gap-3 p-2"
                  data-testid="loading-skeleton"
                  aria-hidden="true"
                >
                  <div className="h-7 w-7 rounded-full bg-muted-foreground/20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-muted-foreground/20"></div>
                    <div className="h-2 w-full rounded bg-muted-foreground/20"></div>
                  </div>
                </div>
              ))
            : (thread?.replies ?? []).map((reply) => (
                <div key={reply.replyId} role="listitem">
                  <CommentReply reply={reply} />
                </div>
              ))}

          {/* Reply to thread button */}
          {onReplyToComment && (
            <button
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-muted-foreground/30 p-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={(e) => {
                e.stopPropagation();
                onReplyToComment(commentId);
              }}
              aria-label={`Reply to thread with ${repliesCount} ${repliesCount === 1 ? "reply" : "replies"}`}
            >
              <span>Reply to thread</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ReplyThread.displayName = "ReplyThread";
