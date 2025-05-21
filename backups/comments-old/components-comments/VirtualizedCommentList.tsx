"use client";

import { CommentCard } from "@/components/comments/CommentCard";
import { Comment } from "@/lib/types/comments";
import { memo, useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  selectedCommentIds: Set<string> | string[];
  expandedThreadIds: Set<string>;
  onSelectComment: (id: string) => void;
  onToggleThread: (id: string) => void;
  onViewFullPost?: (postId: string, commentId: string) => void;
}

/**
 * A comment list component with infinite loading support and expandable threads.
 * This uses a simpler pattern without virtualization to ensure better
 * compatibility with dynamic content like expandable replies.
 */
export const CommentList = memo(function CommentList({
  comments,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  selectedCommentIds,
  expandedThreadIds,
  onSelectComment,
  onToggleThread,
  onViewFullPost,
}: CommentListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Create a map of refs for each comment for better scroll management
  const commentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const selectedSet = Array.isArray(selectedCommentIds)
    ? new Set(selectedCommentIds)
    : selectedCommentIds;

  // Load more ref to trigger loading when scrolled into view
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    rootMargin: "100px",
  });

  // Load more when the load more element is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  // Improved thread toggle with ref-based scrolling
  const handleToggleThread = useCallback(
    (commentId: string) => {
      onToggleThread(commentId);

      // Use requestAnimationFrame to wait for DOM updates
      requestAnimationFrame(() => {
        const commentElement = commentRefs.current.get(commentId);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    },
    [onToggleThread]
  );

  // Handle selection
  const handleSelectComment = useCallback(
    (commentId: string) => {
      onSelectComment(commentId);
    },
    [onSelectComment]
  );

  // Reset refs when comments change
  useEffect(() => {
    commentRefs.current = new Map();
  }, [comments]);

  // Set ref for a comment
  const setCommentRef = useCallback((element: HTMLDivElement | null, commentId: string) => {
    if (element) {
      commentRefs.current.set(commentId, element);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-136px)] min-h-[400px] w-full overflow-auto pr-1"
    >
      {isLoading && comments.length === 0 ? (
        // Loading skeleton
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-full animate-pulse rounded-lg border p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-muted"></div>
                  <div className="h-3 w-full rounded bg-muted"></div>
                  <div className="h-3 w-3/4 rounded bg-muted"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        // Empty state
        <div className="flex w-full flex-col items-center justify-center rounded-lg border p-6 shadow-sm">
          <h3 className="text-lg font-medium">No comments found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        // Regular scroll container with all comments
        <div className="space-y-4 pb-1">
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className="relative w-full"
              ref={(el) => setCommentRef(el, comment.commentId)}
            >
              <CommentCard
                comment={comment}
                isSelected={selectedSet.has(comment.commentId)}
                onSelect={handleSelectComment}
                isExpanded={expandedThreadIds.has(comment.commentId)}
                repliesCount={comment.repliesCount}
                onToggleThread={handleToggleThread}
                onViewFullPost={onViewFullPost}
              />
            </div>
          ))}

          {/* Load more button/indicator */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="mt-4 flex w-full items-center justify-center py-4">
              <button
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="block rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more comments..." : "Load more comments"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// For backwards compatibility - to be removed in future versions
export const VirtualizedCommentList = CommentList;
