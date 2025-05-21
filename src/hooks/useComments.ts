import { useCommentsStore } from "@/components/comments/state/commentsStore";
import type { Comment, CommentFilters } from "@/types/comments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

// API endpoints (to be replaced with actual endpoints)
const API_ENDPOINTS = {
  comments: "/api/comments",
  comment: (id: string) => `/api/comments/${id}`,
};

// Fetch comments with filters
const fetchComments = async (filters: CommentFilters): Promise<Comment[]> => {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.status !== "all") queryParams.append("status", filters.status);
  if (filters.platforms.length) queryParams.append("platforms", filters.platforms.join(","));
  if (filters.emotions.length) queryParams.append("emotions", filters.emotions.join(","));
  if (filters.sentiments.length) queryParams.append("sentiments", filters.sentiments.join(","));
  if (filters.categories.length) queryParams.append("categories", filters.categories.join(","));

  const response = await fetch(`${API_ENDPOINTS.comments}?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

// Update comment status
const updateCommentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<Comment> => {
  const response = await fetch(API_ENDPOINTS.comment(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update comment");
  return response.json();
};

export const useComments = () => {
  const queryClient = useQueryClient();
  const filters = useCommentsStore((state) => state.filters);
  const setComments = useCommentsStore((state) => state.setComments);

  // Query for fetching comments
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", filters],
    queryFn: () => fetchComments(filters),
  });

  // Update comments in store when data changes
  React.useEffect(() => {
    if (comments) {
      setComments(comments);
    }
  }, [comments, setComments]);

  // Mutation for updating comment status
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateCommentStatus,
    onSuccess: (updatedComment) => {
      // Update the cache
      queryClient.setQueryData<Comment[]>(["comments", filters], (oldData) => {
        if (!oldData) return [updatedComment];
        return oldData.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
      });
    },
  });

  return {
    comments,
    isLoading,
    error,
    updateStatus,
    isUpdating,
  };
};
