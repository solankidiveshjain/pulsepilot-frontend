"use client";

import { Comment, CommentFilters } from "@/lib/types/comments";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CommentState {
  comments: Comment[];
  filters: CommentFilters;
  selectedComment: Comment | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  setComments: (comments: Comment[]) => void;
  setFilters: (filters: Partial<CommentFilters>) => void;
  setSelectedComment: (comment: Comment | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: CommentFilters = {
  search: "",
  platform: "all",
  sentiment: "all",
  status: "all",
};

export const useCommentStore = create<CommentState>()(
  devtools(
    (set) => ({
      comments: [],
      filters: DEFAULT_FILTERS,
      selectedComment: null,
      isLoading: false,
      error: null,

      setComments: (comments) => set({ comments }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setSelectedComment: (comment) => set({ selectedComment: comment }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
    }),
    {
      name: "comment-store",
    }
  )
);
