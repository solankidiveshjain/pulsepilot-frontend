"use client";

import { commentsApi } from "@/lib/api/comments/api";
import { Comment, CommentListResponse } from "@/lib/types/comments";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCommentsOptions {
  postId: string;
  pageSize?: number;
}

export function useComments({ postId, pageSize = 20 }: UseCommentsOptions) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CommentListResponse, Error>({
      queryKey: ["comments", postId],
      queryFn: async ({ pageParam }) => {
        const page = typeof pageParam === "number" ? pageParam : 1;
        return commentsApi.getComments({ postId, page, pageSize });
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.comments.length < pageSize) return undefined;
        return lastPage.page + 1;
      },
      initialPageParam: 1,
    });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const updateComment = useMutation({
    mutationFn: async ({
      commentId,
      updates,
    }: {
      commentId: string;
      updates: Partial<Comment>;
    }) => {
      await commentsApi.updateCommentStatus({ commentId, updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update comment");
      console.error("Error updating comment:", error);
    },
  });

  const likeComment = useMutation({
    mutationFn: async (commentId: string) => {
      await commentsApi.likeComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error("Failed to like comment");
      console.error("Error liking comment:", error);
    },
  });

  const unlikeComment = useMutation({
    mutationFn: async (commentId: string) => {
      await commentsApi.unlikeComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error("Failed to unlike comment");
      console.error("Error unliking comment:", error);
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await commentsApi.deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    },
  });

  return {
    comments,
    total,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    loadMore: fetchNextPage,
    updateComment,
    likeComment,
    unlikeComment,
    deleteComment,
  };
}
