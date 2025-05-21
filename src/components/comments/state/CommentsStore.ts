import type { Comment, CommentFilters, Post } from "@/types/comments";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CommentsState {
  // Data
  comments: Comment[];
  selectedComment: Comment | null;
  selectedPost: Post | null;
  filters: CommentFilters;

  // UI State
  isPreviewOpen: boolean;
  isSidebarOpen: boolean;

  // Actions
  setComments: (comments: Comment[]) => void;
  setSelectedComment: (comment: Comment | null) => void;
  setSelectedPost: (post: Post | null) => void;
  setFilters: (filters: Partial<CommentFilters>) => void;
  setPreviewOpen: (isOpen: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;

  // Selectors
  filteredComments: Comment[];
  hasActiveFilters: boolean;
}

const initialFilters: CommentFilters = {
  search: "",
  status: "all",
  platforms: [],
  emotions: [],
  sentiments: [],
  categories: [],
};

export const useCommentsStore = create<CommentsState>()(
  devtools(
    (set, get) => ({
      // Initial State
      comments: [],
      selectedComment: null,
      selectedPost: null,
      filters: initialFilters,
      isPreviewOpen: false,
      isSidebarOpen: false,

      // Actions
      setComments: (comments) => set({ comments }),
      setSelectedComment: (comment) => set({ selectedComment: comment }),
      setSelectedPost: (post) => set({ selectedPost: post }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      setPreviewOpen: (isOpen) => set({ isPreviewOpen: isOpen }),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      // Selectors
      get filteredComments() {
        const { comments, filters } = get();

        return comments.filter((comment) => {
          // Search filter
          if (
            filters.search &&
            !comment.text.toLowerCase().includes(filters.search.toLowerCase())
          ) {
            return false;
          }

          // Status filter
          if (filters.status !== "all" && comment.status !== filters.status) {
            return false;
          }

          // Platform filter
          if (filters.platforms.length > 0 && !filters.platforms.includes(comment.platform)) {
            return false;
          }

          // Emotion filter
          if (filters.emotions.length > 0 && !filters.emotions.includes(comment.emotion)) {
            return false;
          }

          // Sentiment filter
          if (filters.sentiments.length > 0 && !filters.sentiments.includes(comment.sentiment)) {
            return false;
          }

          // Category filter
          if (filters.categories.length > 0 && !filters.categories.includes(comment.category)) {
            return false;
          }

          return true;
        });
      },

      get hasActiveFilters() {
        const { filters } = get();
        return (
          filters.search !== "" ||
          filters.status !== "all" ||
          filters.platforms.length > 0 ||
          filters.emotions.length > 0 ||
          filters.sentiments.length > 0 ||
          filters.categories.length > 0
        );
      },
    }),
    {
      name: "comments-store",
    }
  )
);
