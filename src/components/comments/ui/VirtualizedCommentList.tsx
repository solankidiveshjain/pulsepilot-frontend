"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Comment } from "../models";
import { CommentCard } from "./CommentCard";

export interface VirtualizedCommentListProps {
  comments: Comment[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  selectedCommentIds: string[];
  expandedThreadIds: Set<string>;
  onSelectComment: (commentId: string) => void;
  onToggleThread: (commentId: string) => void;
  onViewFullPost: (postId: string) => void;
  className?: string;
}

// Cache of measured heights for comments
const heightCache = new Map<string, number>();

// Default height for unmeasured items
const DEFAULT_COMMENT_HEIGHT = 140;
// Height of loading indicator
const LOADING_INDICATOR_HEIGHT = 80;

export function VirtualizedCommentList({
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
  className = "",
}: VirtualizedCommentListProps) {
  // Reference to the List component
  const listRef = useRef<List>(null);
  // Reference to the InfiniteLoader component
  const infiniteLoaderRef = useRef<InfiniteLoader>(null);

  // Keep track of which items we've measured
  const [measuredIds, setMeasuredIds] = useState<Set<string>>(new Set());

  // Reset cache when comments change completely
  useEffect(() => {
    if (comments.length === 0) {
      heightCache.clear();
      setMeasuredIds(new Set());
    }
  }, [comments]);

  // Function to get item height
  const getItemHeight = useCallback(
    (index: number) => {
      // Return the height of the loading indicator for the last item if loading more
      if (index === comments.length && (isLoading || isFetchingNextPage)) {
        return LOADING_INDICATOR_HEIGHT;
      }

      // Return default height if index is out of bounds
      if (index >= comments.length) {
        return DEFAULT_COMMENT_HEIGHT;
      }

      const comment = comments[index];
      const commentId = comment.commentId;

      // Check if we have this comment in the heightCache
      if (heightCache.has(commentId)) {
        // Add extra height for expanded threads
        const baseHeight = heightCache.get(commentId) || DEFAULT_COMMENT_HEIGHT;
        const isExpanded = expandedThreadIds.has(commentId);
        const childrenCount = comment.children?.length || 0;

        return isExpanded && childrenCount > 0
          ? baseHeight + childrenCount * DEFAULT_COMMENT_HEIGHT
          : baseHeight;
      }

      return DEFAULT_COMMENT_HEIGHT;
    },
    [comments, expandedThreadIds, isLoading, isFetchingNextPage]
  );

  // Callback when heights are measured
  const setMeasuredHeight = useCallback((commentId: string, height: number) => {
    // Only update if the height is different
    if (heightCache.get(commentId) !== height) {
      heightCache.set(commentId, height);
      setMeasuredIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(commentId);
        return newSet;
      });

      // Reset the list cache to recalculate sizes
      if (listRef.current) {
        listRef.current.resetAfterIndex(0);
      }
    }
  }, []);

  // Determine if an item is loaded
  const isItemLoaded = useCallback(
    (index: number) => {
      return !hasNextPage || index < comments.length;
    },
    [comments.length, hasNextPage]
  );

  // Total number of items to render (including loading indicator)
  const itemCount = hasNextPage ? comments.length + 1 : comments.length;

  // Render individual comment item
  const renderItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      // Show loading indicator for the last item
      if (index === comments.length && (isLoading || isFetchingNextPage)) {
        return (
          <div
            style={style}
            className="flex items-center justify-center py-4"
            data-testid="loading-indicator"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-3 text-sm text-muted-foreground">Loading comments...</span>
          </div>
        );
      }

      // Show placeholder for non-loaded items
      if (index >= comments.length) {
        return <div style={style} className="py-2" />;
      }

      const comment = comments[index];
      return (
        <div style={style} key={comment.commentId} className="py-2">
          <CommentCard
            comment={comment}
            isSelected={selectedCommentIds.includes(comment.commentId)}
            isExpanded={expandedThreadIds.has(comment.commentId)}
            onSelect={() => onSelectComment(comment.commentId)}
            onToggleThread={() => onToggleThread(comment.commentId)}
            onViewFullPost={() => onViewFullPost(comment.postId)}
            onHeightChange={(height) => setMeasuredHeight(comment.commentId, height)}
            hasMeasured={measuredIds.has(comment.commentId)}
          />
        </div>
      );
    },
    [
      comments,
      isLoading,
      isFetchingNextPage,
      selectedCommentIds,
      expandedThreadIds,
      onSelectComment,
      onToggleThread,
      onViewFullPost,
      measuredIds,
      setMeasuredHeight,
    ]
  );

  // When no comments are available
  if (comments.length === 0 && !isLoading) {
    return (
      <div className={`flex h-full flex-col items-center justify-center ${className}`}>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">No comments found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
          <div className="mt-4 bg-yellow-100 p-3 text-sm text-yellow-800">
            <p>
              <strong>Debug:</strong> The comments array is empty. Check console for logs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading state
  if (comments.length === 0 && isLoading) {
    return (
      <div className={`flex h-full items-center justify-center ${className}`}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-muted-foreground">Loading comments...</span>
      </div>
    );
  }

  // Main virtualized list
  return (
    <div className={`h-full w-full ${className}`}>
      {/* Debug panel for development */}
      <div className="mb-6 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
        <h3 className="mb-2 text-base font-semibold">Debug Info - Comments</h3>
        <p className="mb-2 text-sm">{comments.length} comments available to display:</p>
        <div className="max-h-40 overflow-y-auto">
          <pre className="text-xs">
            {JSON.stringify(
              comments.map((c) => ({
                id: c.commentId,
                content: c.content.substring(0, 20) + "...",
                author: c.author.name,
              })),
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            ref={infiniteLoaderRef}
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={isLoading || isFetchingNextPage ? () => {} : onLoadMore}
            threshold={5}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={(list) => {
                  // Combine the refs
                  ref(list);
                  listRef.current = list;
                }}
                height={height - 200} /* Subtract height of debug panel */
                width={width}
                itemCount={itemCount}
                itemSize={getItemHeight}
                onItemsRendered={onItemsRendered}
                overscanCount={3}
                className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
              >
                {renderItem}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
}
