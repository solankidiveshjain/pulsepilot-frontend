import { CommentFilters } from "@/lib/types/comments";
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { CommentModel } from "./CommentModels";

export interface CommentsState {
  // Core data
  comments: CommentModel[];
  isLoading: boolean;
  hasNextPage: boolean;
  error: Error | null;

  // Filters
  filters: CommentFilters;

  // Selection
  selectedIds: Set<string>;
  expandedThreadIds: Set<string>;

  // Actions - Data
  setComments: (comments: CommentModel[]) => void;
  updateComments: (comments: CommentModel[]) => void;
  addComments: (comments: CommentModel[]) => void;
  setLoading: (isLoading: boolean) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
  setError: (error: Error | null) => void;

  // Actions - Filters
  updateFilters: (filters: Partial<CommentFilters>) => void;
  clearFilters: () => void;

  // Actions - Selection
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectMultiple: (ids: string[]) => void;

  // Actions - Thread expansion
  toggleThreadExpansion: (id: string) => void;
  closeAllThreads: () => void;

  // Derived state
  getSelectedComments: () => CommentModel[];
  getFilteredComments: () => CommentModel[];
}

// Define the shape of what we're storing in localStorage
interface PersistedState {
  filters?: CommentFilters;
  expandedThreadIds?: string[];
}

export const useCommentsStore = create<CommentsState>()(
  persist(
    subscribeWithSelector(
      devtools(
        (set, get) => ({
          // Initial state
          comments: [],
          isLoading: false,
          hasNextPage: false,
          error: null,
          filters: {},
          selectedIds: new Set<string>(),
          expandedThreadIds: new Set<string>(),

          // Actions - Data
          setComments: (rawComments) => {
            const comments = rawComments.map((c) => new CommentModel(c));
            set({ comments });
          },

          updateComments: (rawComments) => {
            const comments = rawComments.map((c) => new CommentModel(c));
            set({ comments });
          },

          addComments: (rawComments) => {
            const newComments = rawComments.map((c) => new CommentModel(c));
            set((state) => ({
              comments: [...state.comments, ...newComments],
            }));
          },

          setLoading: (isLoading) => set({ isLoading }),
          setHasNextPage: (hasNextPage) => set({ hasNextPage }),
          setError: (error) => set({ error }),

          // Actions - Filters
          updateFilters: (newFilters) => {
            set((state) => ({
              filters: { ...state.filters, ...newFilters },
            }));
          },

          clearFilters: () => set({ filters: {} }),

          // Actions - Selection
          toggleSelection: (id) => {
            set((state) => {
              const newSelectedIds = new Set(state.selectedIds);
              if (newSelectedIds.has(id)) {
                newSelectedIds.delete(id);
              } else {
                newSelectedIds.add(id);
              }
              return { selectedIds: newSelectedIds };
            });
          },

          clearSelection: () => set({ selectedIds: new Set() }),

          selectMultiple: (ids) => {
            set((state) => {
              const newSelectedIds = new Set(state.selectedIds);
              ids.forEach((id) => newSelectedIds.add(id));
              return { selectedIds: newSelectedIds };
            });
          },

          // Actions - Thread expansion
          toggleThreadExpansion: (id) => {
            set((state) => {
              const newExpandedThreadIds = new Set(state.expandedThreadIds);
              if (newExpandedThreadIds.has(id)) {
                newExpandedThreadIds.delete(id);
              } else {
                newExpandedThreadIds.add(id);
              }
              return { expandedThreadIds: newExpandedThreadIds };
            });
          },

          closeAllThreads: () => set({ expandedThreadIds: new Set() }),

          // Derived state
          getSelectedComments: () => {
            const { comments, selectedIds } = get();
            return comments.filter((comment) => selectedIds.has(comment.id));
          },

          getFilteredComments: () => {
            const { comments, filters } = get();
            return comments.filter((comment) => comment.matchesFilters(filters));
          },
        }),
        { name: "comments-store" }
      )
    ),
    {
      name: "pulsepilot-comments-storage",
      partialize: (state) => ({
        // Only persist filters and expanded thread IDs, not data or selection
        filters: state.filters,
        expandedThreadIds: Array.from(state.expandedThreadIds),
      }),
      // Custom storage serialization to handle Set objects
      merge: (persisted: unknown, current) => {
        const persistedState = persisted as PersistedState;
        return {
          ...current,
          filters: persistedState?.filters || {},
          expandedThreadIds: persistedState?.expandedThreadIds
            ? new Set(persistedState.expandedThreadIds)
            : new Set(),
        };
      },
    }
  )
);

// Create custom selectors for fine-grained subscriptions
export const selectFilteredComments = (state: CommentsState) => state.getFilteredComments();
export const selectSelectedComments = (state: CommentsState) => state.getSelectedComments();
export const selectSelectedCount = (state: CommentsState) => state.selectedIds.size;
export const selectComments = (state: CommentsState) => state.comments || [];
export const selectFilters = (state: CommentsState) => state.filters;
export const selectIsLoading = (state: CommentsState) => state.isLoading;
export const selectHasNextPage = (state: CommentsState) => state.hasNextPage;
export const selectIsCommentSelected = (state: CommentsState, id: string) =>
  state.selectedIds.has(id);
export const selectIsThreadExpanded = (state: CommentsState, id: string) =>
  state.expandedThreadIds.has(id);
