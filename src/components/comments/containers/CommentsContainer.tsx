"use client";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useCallback, useEffect } from "react";
import { useBulkActions, useCommentMetrics, useCommentsFeed } from "../state/useCommentsFeed";
import {
  useActivePost,
  useFilterSelections,
  useMobileSidebar,
  useSelectedComments,
} from "../state/useCommentsStore";
import { ContextBar } from "../ui/ContextBar";
import { FilterSidebar } from "../ui/FilterSidebar";
import { FilterToolbar } from "../ui/FilterToolbar";
import { PostDetailsPanel } from "../ui/PostDetailsPanel";
import { SimpleCommentList } from "../ui/SimpleCommentList";
import { CommentsLayout } from "./CommentsLayout";

/**
 * Main container component for the comments interface
 * Handles loading, data fetching, and state management
 */
export function CommentsContainer() {
  // Data fetching with React Query
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

  // Debug logging
  useEffect(() => {
    console.log("CommentsContainer rendered with:", {
      commentCount: comments.length,
      isLoading,
      isError,
      hasNextPage,
      filters,
    });
  }, [comments, isLoading, isError, hasNextPage, filters]);

  // Get comment metrics for filter counts
  const { metrics } = useCommentMetrics();

  // Get state from Zustand store via selectors
  const { selectedComments, toggleComment, unselectAll, selectedCount } = useSelectedComments();

  const { activePostId, setActivePostId } = useActivePost();

  const { isMobileSidebarOpen, setMobileSidebarOpen } = useMobileSidebar();

  const {
    selectedEmotions,
    selectedSentiments,
    selectedCategories,
    setSelectedEmotions,
    setSelectedSentiments,
    setSelectedCategories,
  } = useFilterSelections();

  // Bulk actions helper
  const { performBulkAction } = useBulkActions();

  // Handle view full post
  const handleViewFullPost = useCallback(
    (postId: string) => {
      setActivePostId(postId);
    },
    [setActivePostId]
  );

  // Handle closing post details
  const handleClosePostDetails = useCallback(() => {
    setActivePostId(null);
  }, [setActivePostId]);

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

  // Determine if bulk action toolbar is visible
  const isBulkToolbarVisible = selectedCount > 0;

  return (
    <CommentsLayout
      sidebarContent={
        <ErrorBoundary>
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
            metrics={metrics}
            selectedEmotions={selectedEmotions}
            selectedSentiments={selectedSentiments}
            selectedCategories={selectedCategories}
            selectedCommentIds={selectedComments}
            onEmotionChange={setSelectedEmotions}
            onSentimentChange={setSelectedSentiments}
            onCategoryChange={setSelectedCategories}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        </ErrorBoundary>
      }
      rightPanelContent={
        activePostId && <PostDetailsPanel postId={activePostId} onClose={handleClosePostDetails} />
      }
      rightPanelVisible={!!activePostId}
      isMobileSidebarOpen={isMobileSidebarOpen}
      onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
      onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
    >
      <div className="flex h-full flex-col">
        {/* Debug info */}
        <div className="bg-yellow-100 p-2 text-xs">
          <p>
            Debug: {comments.length} comments, Loading: {String(isLoading)}, Error:{" "}
            {String(isError)}
          </p>
        </div>

        {/* Header */}
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Comments</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage and respond to comments across all your connected platforms
              </p>
            </div>
          </div>

          {/* Active Filters Section */}
          <div className="mt-3">
            {Object.keys(filters).length > 0 ||
            selectedEmotions.length > 0 ||
            selectedSentiments.length > 0 ||
            selectedCategories.length > 0 ? (
              <div className="flex items-center border-t border-border pt-3">
                <div className="mr-4 whitespace-nowrap text-xs font-medium uppercase tracking-wide">
                  ACTIVE FILTERS:
                </div>
                <div className="flex-1 overflow-x-auto pb-1">
                  <ContextBar
                    filters={filters}
                    onClearFilters={() => {
                      updateFilters({});
                      setSelectedEmotions([]);
                      setSelectedSentiments([]);
                      setSelectedCategories([]);
                    }}
                    emotions={selectedEmotions}
                    sentiments={selectedSentiments}
                    categories={selectedCategories}
                  />
                </div>
                <button
                  onClick={() => {
                    updateFilters({});
                    setSelectedEmotions([]);
                    setSelectedSentiments([]);
                    setSelectedCategories([]);
                  }}
                  className="ml-3 rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Clear All
                </button>
              </div>
            ) : (
              <div className="flex items-center border-t border-border pt-3">
                <div className="mr-2 text-xs font-medium uppercase tracking-wide">
                  No active filters
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments list */}
        <div className="flex-1 p-4">
          {/* Mobile Filters Toolbar */}
          <div className="mb-4 lg:hidden">
            <FilterToolbar filters={filters} onFilterChange={updateFilters} metrics={metrics} />
          </div>

          {/* Comments List with error boundary */}
          <ErrorBoundary
            fallback={
              <div className="mx-auto max-w-[720px] rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
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
              <div className="mx-auto flex h-40 max-w-[720px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                <p className="text-center text-red-600 dark:text-red-400">
                  Error loading comments. Please try again.
                </p>
              </div>
            ) : (
              <div className="mx-auto max-w-[720px]">
                <SimpleCommentList
                  comments={comments}
                  isLoading={isLoading}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={handleLoadMore}
                  selectedCommentIds={selectedComments}
                  onSelectComment={toggleComment}
                  onViewFullPost={handleViewFullPost}
                  className="w-full"
                />
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>

      {/* Bulk action toolbar - conditional render at bottom */}
      {isBulkToolbarVisible && (
        <div className="sticky bottom-0 border-t border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center">
              <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-sm font-medium text-white">
                {selectedCount}
              </span>
              <span className="text-sm font-medium">
                {selectedCount === 1 ? "comment" : "comments"} selected
              </span>
              <button
                onClick={unselectAll}
                className="ml-3 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Clear selection"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  performBulkAction("mark_read", selectedComments);
                  unselectAll();
                }}
                className="rounded bg-primary px-3 py-1.5 text-sm font-medium text-white"
              >
                Mark as Read
              </button>
              <button
                onClick={() => {
                  performBulkAction("archive", selectedComments);
                  unselectAll();
                }}
                className="rounded bg-gray-100 px-3 py-1.5 text-sm font-medium dark:bg-gray-800"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </CommentsLayout>
  );
}
