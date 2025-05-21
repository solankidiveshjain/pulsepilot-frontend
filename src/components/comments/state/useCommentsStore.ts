import { create } from "zustand";
import { Comment, CommentFilter, CommentMetrics, Post } from "../models";

export type CommentsState = {
  // Data
  comments: Comment[];
  metrics: CommentMetrics | null;
  selectedComments: string[];
  expandedThreads: Set<string>;
  activePost: Post | null;
  activePostId: string | null;
  isMobileSidebarOpen: boolean;

  // Filters
  filters: CommentFilter;
  selectedEmotions: string[];
  selectedSentiments: string[];
  selectedCategories: string[];

  // UI States
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;

  // Actions
  setComments: (comments: Comment[]) => void;
  setMetrics: (metrics: CommentMetrics) => void;
  toggleComment: (commentId: string) => void;
  unselectAll: () => void;
  toggleThread: (commentId: string) => void;
  setActivePost: (post: Post | null) => void;
  setActivePostId: (postId: string | null) => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  updateFilters: (newFilters: Partial<CommentFilter>) => void;
  setSelectedEmotions: (emotions: string[]) => void;
  setSelectedSentiments: (sentiments: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setLoadingState: (isLoading: boolean) => void;
  setFetchingNextPage: (isFetching: boolean) => void;
  setHasNextPage: (hasNext: boolean) => void;
  setError: (hasError: boolean) => void;
  clearAllFilters: () => void;
};

export const useCommentsStore = create<CommentsState>((set) => ({
  // Initial Data
  comments: [],
  metrics: null,
  selectedComments: [],
  expandedThreads: new Set<string>(),
  activePost: null,
  activePostId: null,
  isMobileSidebarOpen: false,

  // Initial Filters
  filters: {},
  selectedEmotions: [],
  selectedSentiments: [],
  selectedCategories: [],

  // Initial UI States
  isLoading: false,
  isFetchingNextPage: false,
  hasNextPage: false,
  isError: false,

  // Actions
  setComments: (comments) => set({ comments }),

  setMetrics: (metrics) => set({ metrics }),

  toggleComment: (commentId) =>
    set((state) => {
      const isSelected = state.selectedComments.includes(commentId);
      return {
        selectedComments: isSelected
          ? state.selectedComments.filter((id) => id !== commentId)
          : [...state.selectedComments, commentId],
      };
    }),

  unselectAll: () => set({ selectedComments: [] }),

  toggleThread: (commentId) =>
    set((state) => {
      const newExpandedThreads = new Set(state.expandedThreads);
      if (newExpandedThreads.has(commentId)) {
        newExpandedThreads.delete(commentId);
      } else {
        newExpandedThreads.add(commentId);
      }
      return { expandedThreads: newExpandedThreads };
    }),

  setActivePost: (post) => set({ activePost: post }),

  setActivePostId: (postId) => set({ activePostId: postId }),

  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSelectedEmotions: (emotions) => set({ selectedEmotions: emotions }),

  setSelectedSentiments: (sentiments) => set({ selectedSentiments: sentiments }),

  setSelectedCategories: (categories) => set({ selectedCategories: categories }),

  setLoadingState: (isLoading) => set({ isLoading }),

  setFetchingNextPage: (isFetching) => set({ isFetchingNextPage: isFetching }),

  setHasNextPage: (hasNext) => set({ hasNextPage: hasNext }),

  setError: (hasError) => set({ isError: hasError }),

  clearAllFilters: () =>
    set({
      filters: {},
      selectedEmotions: [],
      selectedSentiments: [],
      selectedCategories: [],
    }),
}));

// Selectors for accessing specific parts of state
export const useComments = () => useCommentsStore((state) => state.comments);
export const useSelectedComments = () =>
  useCommentsStore((state) => ({
    selectedComments: state.selectedComments,
    toggleComment: state.toggleComment,
    unselectAll: state.unselectAll,
    selectedCount: state.selectedComments.length,
  }));
export const useExpandedThreads = () =>
  useCommentsStore((state) => ({
    expandedThreads: state.expandedThreads,
    toggleThread: state.toggleThread,
  }));
export const useActivePost = () =>
  useCommentsStore((state) => ({
    activePost: state.activePost,
    activePostId: state.activePostId,
    setActivePost: state.setActivePost,
    setActivePostId: state.setActivePostId,
  }));
export const useFilters = () =>
  useCommentsStore((state) => ({
    filters: state.filters,
    updateFilters: state.updateFilters,
    clearAllFilters: state.clearAllFilters,
  }));
export const useFilterSelections = () =>
  useCommentsStore((state) => ({
    selectedEmotions: state.selectedEmotions,
    selectedSentiments: state.selectedSentiments,
    selectedCategories: state.selectedCategories,
    setSelectedEmotions: state.setSelectedEmotions,
    setSelectedSentiments: state.setSelectedSentiments,
    setSelectedCategories: state.setSelectedCategories,
  }));
export const useLoadingState = () =>
  useCommentsStore((state) => ({
    isLoading: state.isLoading,
    isFetchingNextPage: state.isFetchingNextPage,
    hasNextPage: state.hasNextPage,
    isError: state.isError,
    setLoadingState: state.setLoadingState,
    setFetchingNextPage: state.setFetchingNextPage,
    setHasNextPage: state.setHasNextPage,
    setError: state.setError,
  }));
export const useMobileSidebar = () =>
  useCommentsStore((state) => ({
    isMobileSidebarOpen: state.isMobileSidebarOpen,
    setMobileSidebarOpen: state.setMobileSidebarOpen,
  }));
