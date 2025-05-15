"use client";

import { BulkActionToolbar } from "@/components/comments/BulkActionToolbar";
import { FilterToolbar } from "@/components/comments/FilterToolbar";
import { CommentList } from "@/components/comments/VirtualizedCommentList";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useCommentMetrics, useCommentsFeed, useSelectedComments } from "@/hooks/use-comments";
import { useCallback, useState } from "react";

export default function CommentsPage() {
  // State for expanded threads
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  // Get comments with filtering
  const {
    comments,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filters,
    updateFilters,
    refetch,
  } = useCommentsFeed();

  // Get comment metrics for filter counts
  const { metrics } = useCommentMetrics();

  // Manage selected comments for bulk actions
  const { selectedComments, toggleComment, unselectAll, selectedCount } = useSelectedComments();

  // Toggle thread expansion
  const toggleThread = useCallback((commentId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  // Load more comments when user reaches the end of the list
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle error retry
  const handleErrorRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container relative mx-auto space-y-4 py-4">
      <h1 className="text-2xl font-bold">Comments</h1>
      <p className="text-muted-foreground">
        Manage and respond to comments across all your connected platforms.
      </p>

      {/* Filters */}
      <FilterToolbar filters={filters} onFilterChange={updateFilters} metrics={metrics} />

      {/* Comments List with error boundary */}
      <ErrorBoundary
        fallback={
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-center text-red-700 dark:text-red-400">
              Something went wrong loading comments. Please try again.
            </p>
            <button
              onClick={handleErrorRetry}
              className="mx-auto mt-2 block rounded-md bg-primary px-3 py-1 text-sm font-medium text-white"
            >
              Retry
            </button>
          </div>
        }
      >
        {isError ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-center text-red-600 dark:text-red-400">
              Error loading comments. Please try again.
            </p>
          </div>
        ) : (
          <CommentList
            comments={comments}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
            selectedCommentIds={selectedComments}
            expandedThreadIds={expandedThreads}
            onSelectComment={toggleComment}
            onToggleThread={toggleThread}
          />
        )}
      </ErrorBoundary>

      {/* Bulk action toolbar - fixed at bottom */}
      <BulkActionToolbar
        selectedCount={selectedCount}
        onUnselectAll={unselectAll}
        commentIds={selectedComments}
      />
    </div>
  );
}
