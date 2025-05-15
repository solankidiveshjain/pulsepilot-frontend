import {
  bulkActionComments,
  fetchCommentMetrics,
  fetchCommentsFeed,
  fetchCommentThread,
  fetchPostPreview,
} from "@/lib/api/comments";
import { BulkAction, Comment, CommentFilters, PostPreview } from "@/lib/types/comments";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

// Post preview cache using Map
const postPreviewCache = new Map<string, PostPreview>();

/**
 * Hook for fetching paginated comments with filtering
 */
export function useCommentsFeed(initialFilters: CommentFilters = {}) {
  const [filters, setFilters] = useState<CommentFilters>(initialFilters);

  // Use TanStack Query's useInfiniteQuery for pagination
  const commentsQuery = useInfiniteQuery({
    queryKey: ["comments", "feed", filters],
    queryFn: ({ pageParam = 1 }) => fetchCommentsFeed(pageParam as number, undefined, filters),
    getNextPageParam: (lastPage) => (lastPage.nextCursor ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });

  // Flatten comments from all pages
  const comments = useMemo(() => {
    if (!commentsQuery.data) return [];
    return commentsQuery.data.pages.flatMap((page) => page.comments);
  }, [commentsQuery.data]);

  // Update filters
  const updateFilters = useCallback((newFilters: CommentFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    comments,
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    error: commentsQuery.error,
    hasNextPage: commentsQuery.hasNextPage,
    fetchNextPage: commentsQuery.fetchNextPage,
    filters,
    updateFilters,
    isFetchingNextPage: commentsQuery.isFetchingNextPage,
    refetch: commentsQuery.refetch,
  };
}

/**
 * Hook for managing post previews with caching
 */
export function usePostPreview(postId: string) {
  // Check cache first before fetching
  const cachedPreview = postPreviewCache.get(postId);

  const postQuery = useQuery({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostPreview(postId),
    enabled: !cachedPreview, // Only fetch if not in cache
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // If data is fetched, update the cache
  if (postQuery.data && !cachedPreview) {
    postPreviewCache.set(postId, postQuery.data);
  }

  return {
    postPreview: cachedPreview || postQuery.data,
    isLoading: postQuery.isLoading,
    isError: postQuery.isError,
  };
}

/**
 * Hook for fetching and managing comment thread replies
 */
export function useCommentThread(commentId: string, enabled = false) {
  const threadQuery = useQuery({
    queryKey: ["comments", commentId, "thread"],
    queryFn: () => fetchCommentThread(commentId),
    enabled, // Only fetch when explicitly enabled (e.g., when thread is expanded)
    staleTime: 60000, // Cache results for 1 minute
    retry: 2, // Retry failed requests twice
  });

  return {
    thread: threadQuery.data,
    isLoading: threadQuery.isLoading,
    isError: threadQuery.isError,
    refetch: threadQuery.refetch,
    status: threadQuery.status,
    isFetching: threadQuery.isFetching,
  };
}

/**
 * Hook for fetching comment metrics
 */
export function useCommentMetrics() {
  const metricsQuery = useQuery({
    queryKey: ["comments", "metrics"],
    queryFn: fetchCommentMetrics,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  return {
    metrics: metricsQuery.data,
    isLoading: metricsQuery.isLoading,
    isError: metricsQuery.isError,
  };
}

/**
 * Hook for performing bulk actions on comments
 */
export function useBulkActions() {
  const queryClient = useQueryClient();

  const bulkActionMutation = useMutation({
    mutationFn: bulkActionComments,
    onSuccess: () => {
      // Invalidate the comments feed query to refetch data
      queryClient.invalidateQueries({ queryKey: ["comments", "feed"] });
      // Also invalidate metrics since they may have changed
      queryClient.invalidateQueries({ queryKey: ["comments", "metrics"] });
    },
  });

  // Helper function to perform a bulk action
  const performBulkAction = useCallback(
    (action: BulkAction, commentIds: string[]) => {
      return bulkActionMutation.mutate({
        action,
        commentIds,
      });
    },
    [bulkActionMutation]
  );

  return {
    performBulkAction,
    isLoading: bulkActionMutation.isPending,
    isError: bulkActionMutation.isError,
    error: bulkActionMutation.error,
    isSuccess: bulkActionMutation.isSuccess,
  };
}

/**
 * Hook for managing selected comments (for bulk actions)
 */
export function useSelectedComments() {
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());

  const toggleComment = useCallback((commentId: string) => {
    setSelectedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const selectComments = useCallback((commentIds: string[]) => {
    setSelectedComments((prev) => {
      const newSet = new Set(prev);
      commentIds.forEach((id) => newSet.add(id));
      return newSet;
    });
  }, []);

  const unselectAll = useCallback(() => {
    setSelectedComments(new Set());
  }, []);

  const selectAll = useCallback((comments: Comment[]) => {
    setSelectedComments(new Set(comments.map((comment) => comment.commentId)));
  }, []);

  return {
    selectedComments: Array.from(selectedComments),
    isSelected: (commentId: string) => selectedComments.has(commentId),
    toggleComment,
    selectComments,
    unselectAll,
    selectAll,
    selectedCount: selectedComments.size,
    hasSelected: selectedComments.size > 0,
  };
}
