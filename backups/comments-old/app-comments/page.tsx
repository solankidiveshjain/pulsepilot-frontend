"use client";

import { FilterSidebar } from "@/components/comments/FilterSidebar";
import { FilterToolbar } from "@/components/comments/FilterToolbar";
import { PostDetailsPanel } from "@/components/comments/PostDetailsPanel";
import { CommentList } from "@/components/comments/VirtualizedCommentList";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import {
  useBulkActions,
  useCommentMetrics,
  useCommentsFeed,
  useSelectedComments,
} from "@/hooks/use-comments";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Check, Flag, Menu, MoreHorizontal, X } from "lucide-react";
import { useCallback, useState } from "react";
import { ContextBar } from "../../../components/comments/ContextBar";

export default function CommentsPage() {
  // State for expanded threads
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  // State for mobile sidebar
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // State for storing filter info that might not be in the API yet
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // State for tracking the currently viewed post
  const [activePostId, setActivePostId] = useState<string | null>(null);

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

  // Handle view full post
  const handleViewFullPost = useCallback((postId: string) => {
    setActivePostId(postId);
    // On mobile, we might want to navigate to a dedicated post page
  }, []);

  // Handle closing post details
  const handleClosePostDetails = useCallback(() => {
    setActivePostId(null);
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

  // Clear all filters including the ones not in the API yet
  const clearAllFilters = useCallback(() => {
    updateFilters({});
    setSelectedEmotions([]);
    setSelectedSentiments([]);
    setSelectedCategories([]);
  }, [updateFilters]);

  // Find the selected comment data
  const selectedComment =
    selectedCount === 1
      ? comments.find((comment) => comment.commentId === selectedComments[0])
      : null;

  // Determine which post to show in the details panel
  const postToShow = activePostId || selectedComment?.postId || null;

  // Determine if bulk action toolbar is visible
  const isBulkToolbarVisible = selectedCount > 0;

  return (
    <div className="h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      {/* Main container with max-width constraint and proper grid layout */}
      <div className="relative mx-auto h-full max-w-[1440px] px-6">
        {/* Desktop 3-column grid layout */}
        <div className="grid hidden h-full grid-cols-[280px_minmax(0,1fr)_360px] gap-6 lg:grid">
          {/* Left column - Filters */}
          <div className="border-r border-border bg-card">
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
            />
          </div>

          {/* Main content area - Center column with comment feed */}
          <main className="flex flex-col overflow-hidden bg-background">
            {/* Header and Filters */}
            <div className="border-b border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Comments</h1>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage and respond to comments across all your connected platforms.
                  </p>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm lg:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Active Filters Section with improved horizontal spacing */}
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
                        onClearFilters={clearAllFilters}
                        emotions={selectedEmotions}
                        sentiments={selectedSentiments}
                        categories={selectedCategories}
                      />
                    </div>
                    <button
                      onClick={clearAllFilters}
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

            {/* Comments List with proper spacing and max-width constraints */}
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
                      onViewFullPost={handleViewFullPost}
                    />
                  </div>
                )}
              </ErrorBoundary>
            </div>
          </main>

          {/* Right Panel - Post details */}
          {postToShow ? (
            <aside className="hidden border-l border-border bg-card lg:block">
              <div className="h-full overflow-hidden">
                <PostDetailsPanel postId={postToShow} onClose={handleClosePostDetails} />
              </div>
            </aside>
          ) : (
            <div className="hidden lg:block"></div> // Empty column to maintain grid layout
          )}
        </div>

        {/* Mobile layout */}
        <div className="flex h-full flex-col lg:hidden">
          <main className="flex flex-1 flex-col overflow-hidden bg-background">
            {/* Header and Filters - Same as desktop */}
            <div className="border-b border-border bg-card px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Comments</h1>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage and respond to comments across all your connected platforms.
                  </p>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="flex items-center gap-1.5 rounded-md border border-input px-3 py-2 text-sm"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                  <span>Filters</span>
                </button>
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
                        onClearFilters={clearAllFilters}
                        emotions={selectedEmotions}
                        sentiments={selectedSentiments}
                        categories={selectedCategories}
                      />
                    </div>
                    <button
                      onClick={clearAllFilters}
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

            {/* Comments List */}
            <div className="flex-1 p-4">
              {/* Mobile Filters Toolbar */}
              <div className="mb-4">
                <FilterToolbar filters={filters} onFilterChange={updateFilters} metrics={metrics} />
              </div>

              {/* Comments List */}
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
                    onViewFullPost={handleViewFullPost}
                  />
                )}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile filters panel */}
      {isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-card lg:hidden">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
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
                  isMobile={true}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Mobile Post Detail Panel */}
      <AnimatePresence>
        {postToShow && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePostDetails}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 block max-h-[80vh] overflow-auto rounded-t-xl border-t border-border bg-card shadow-lg lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-3">
                <h3 className="text-base font-medium">Post Details</h3>
                <button
                  onClick={handleClosePostDetails}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <PostDetailsPanel postId={postToShow} onClose={handleClosePostDetails} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bulk action toolbar - fixed at bottom */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <span className="text-sm font-semibold">{selectedCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {selectedCount} {selectedCount === 1 ? "comment" : "comments"} selected
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {selectedComments.slice(0, 3).map((id) => (
                    <span
                      key={id}
                      className="max-w-[120px] truncate rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800"
                    >
                      {`ID-${id.substring(0, 6)}`}
                    </span>
                  ))}
                  {selectedComments.length > 3 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                      +{selectedComments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={unselectAll}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:hover:bg-gray-800"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-4 dark:border-gray-700">
              <button
                onClick={() => {
                  const { performBulkAction } = useBulkActions();
                  performBulkAction("mark_read", selectedComments);
                  unselectAll();
                }}
                className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Mark as read"
              >
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Mark Read
              </button>

              <button
                onClick={() => {
                  const { performBulkAction } = useBulkActions();
                  performBulkAction("archive", selectedComments);
                  unselectAll();
                }}
                className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Archive comments"
              >
                <Archive className="mr-2 h-4 w-4 text-blue-500" />
                Archive
              </button>

              <button
                onClick={() => {
                  const { performBulkAction } = useBulkActions();
                  performBulkAction("flag", selectedComments);
                  unselectAll();
                }}
                className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Flag comments"
              >
                <Flag className="mr-2 h-4 w-4 text-red-500" />
                Flag
              </button>

              <div className="relative">
                <button
                  className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
