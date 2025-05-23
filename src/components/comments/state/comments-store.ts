import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { Comment, FilterState, Post } from "@/types"
import { mockComments, mockPosts } from "@/lib/mock-data"

interface CommentsState {
  // Data
  comments: Comment[]
  filteredComments: Comment[]
  selectedComment: Comment | null
  selectedPost: Post | null

  // UI State
  isPreviewOpen: boolean
  isSidebarOpen: boolean
  expandedComments: string[]
  expandedReplies: string[]
  selectedComments: string[]
  isLoading: boolean

  // Filters
  filters: FilterState

  // Actions
  setComments: (comments: Comment[]) => void
  setSelectedComment: (comment: Comment | null) => void
  setIsPreviewOpen: (isOpen: boolean) => void
  setIsSidebarOpen: (isOpen: boolean) => void
  toggleExpandComment: (commentId: string) => void
  toggleExpandReply: (commentId: string) => void
  toggleCommentSelection: (commentId: string) => void
  selectAllComments: () => void
  clearSelectedComments: () => void
  updateFilters: (newFilters: Partial<FilterState>) => void
  clearAllFilters: () => void
  archiveComments: (commentIds: string[]) => void
  flagComment: (commentId: string, flagged: boolean) => void
  markCommentAsImportant: (commentId: string) => void
  deleteComment: (commentId: string) => void
  saveCommentForLater: (commentId: string) => void
}

const initialFilters: FilterState = {
  search: "",
  status: "all",
  platforms: [],
  emotions: [],
  sentiments: [],
  categories: [],
}

export const useCommentsStore = create<CommentsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial data
        comments: mockComments,
        filteredComments: mockComments,
        selectedComment: null,
        selectedPost: null,

        // UI State
        isPreviewOpen: false,
        isSidebarOpen: false,
        expandedComments: [],
        expandedReplies: [],
        selectedComments: [],
        isLoading: false,

        // Filters
        filters: initialFilters,

        // Actions
        setComments: (comments) => {
          set({ comments, filteredComments: comments })
        },

        setSelectedComment: (comment) => {
          set({ selectedComment: comment })

          if (comment) {
            const post = mockPosts.find((p) => p.id === comment.postId)
            set({ selectedPost: post || null, isPreviewOpen: true })
          }
        },

        setIsPreviewOpen: (isOpen) => set({ isPreviewOpen: isOpen }),

        setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

        toggleExpandComment: (commentId) => {
          const { expandedComments } = get()
          const isExpanded = expandedComments.includes(commentId)

          set({
            expandedComments: isExpanded
              ? expandedComments.filter((id) => id !== commentId)
              : [...expandedComments, commentId],
          })
        },

        toggleExpandReply: (commentId) => {
          const { expandedReplies } = get()
          const isExpanded = expandedReplies.includes(commentId)

          set({
            expandedReplies: isExpanded
              ? expandedReplies.filter((id) => id !== commentId)
              : [...expandedReplies, commentId],
          })
        },

        toggleCommentSelection: (commentId) => {
          const { selectedComments } = get()
          const isSelected = selectedComments.includes(commentId)

          set({
            selectedComments: isSelected
              ? selectedComments.filter((id) => id !== commentId)
              : [...selectedComments, commentId],
          })
        },

        selectAllComments: () => {
          const { comments, filteredComments, selectedComments } = get()
          const commentsToUse = filteredComments.length > 0 ? filteredComments : comments

          if (selectedComments.length === commentsToUse.length) {
            set({ selectedComments: [] })
          } else {
            set({ selectedComments: commentsToUse.map((comment) => comment.id) })
          }
        },

        clearSelectedComments: () => set({ selectedComments: [] }),

        updateFilters: (newFilters) => {
          const { filters, comments } = get()
          const updatedFilters = { ...filters, ...newFilters }

          // Apply filters to comments
          const filtered = comments.filter((comment) => {
            // Search filter
            if (updatedFilters.search && !comment.text.toLowerCase().includes(updatedFilters.search.toLowerCase())) {
              return false
            }

            // Status filter
            if (updatedFilters.status !== "all") {
              if (updatedFilters.status === "flagged" && !comment.flagged) return false
              if (updatedFilters.status === "attention" && !comment.needsAttention) return false
              if (updatedFilters.status === "archived" && !comment.archived) return false
            }

            // Platform filter
            if (updatedFilters.platforms.length > 0 && !updatedFilters.platforms.includes(comment.platform)) {
              return false
            }

            // Emotion filter
            if (updatedFilters.emotions.length > 0 && !updatedFilters.emotions.includes(comment.emotion)) {
              return false
            }

            // Sentiment filter
            if (updatedFilters.sentiments.length > 0 && !updatedFilters.sentiments.includes(comment.sentiment)) {
              return false
            }

            // Category filter
            if (updatedFilters.categories.length > 0 && !updatedFilters.categories.includes(comment.category)) {
              return false
            }

            return true
          })

          set({ filters: updatedFilters, filteredComments: filtered })
        },

        clearAllFilters: () => {
          set({
            filters: initialFilters,
            filteredComments: get().comments,
          })
        },

        archiveComments: (commentIds) => {
          const { comments } = get()
          const updatedComments = comments.map((comment) => {
            if (commentIds.includes(comment.id)) {
              return { ...comment, archived: true }
            }
            return comment
          })

          set({ comments: updatedComments })
          get().updateFilters({}) // Re-apply filters
        },

        flagComment: (commentId, flagged) => {
          const { comments } = get()
          const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, flagged }
            }
            return comment
          })

          set({ comments: updatedComments })
          get().updateFilters({}) // Re-apply filters
        },

        markCommentAsImportant: (commentId) => {
          const { comments } = get()
          const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, category: "vip" }
            }
            return comment
          })

          set({ comments: updatedComments })
          get().updateFilters({}) // Re-apply filters
        },

        deleteComment: (commentId) => {
          const { comments, selectedComments } = get()
          const updatedComments = comments.filter((comment) => comment.id !== commentId)
          const updatedSelectedComments = selectedComments.filter((id) => id !== commentId)

          set({
            comments: updatedComments,
            selectedComments: updatedSelectedComments,
          })
          get().updateFilters({}) // Re-apply filters
        },

        saveCommentForLater: (commentId) => {
          // In a real app, this would save to a database
          // For now, we'll just mark it as a VIP comment
          get().markCommentAsImportant(commentId)
        },
      }),
      {
        name: "comments-storage",
        partialize: (state) => ({
          // Only persist these fields
          filters: state.filters,
          expandedComments: state.expandedComments,
          expandedReplies: state.expandedReplies,
        }),
      },
    ),
  ),
)

// Selectors for derived state
export const useFilteredComments = () => useCommentsStore((state) => state.filteredComments)
export const useSelectedComment = () => useCommentsStore((state) => state.selectedComment)
export const useSelectedPost = () => useCommentsStore((state) => state.selectedPost)
export const useIsPreviewOpen = () => useCommentsStore((state) => state.isPreviewOpen)
export const useIsSidebarOpen = () => useCommentsStore((state) => state.isSidebarOpen)
export const useExpandedComments = () => useCommentsStore((state) => state.expandedComments)
export const useExpandedReplies = () => useCommentsStore((state) => state.expandedReplies)
export const useSelectedComments = () => useCommentsStore((state) => state.selectedComments)
export const useFilters = () => useCommentsStore((state) => state.filters)
export const useIsLoading = () => useCommentsStore((state) => state.isLoading)

// Action selectors
export const useCommentsActions = () => {
  const {
    setComments,
    setSelectedComment,
    setIsPreviewOpen,
    setIsSidebarOpen,
    toggleExpandComment,
    toggleExpandReply,
    toggleCommentSelection,
    selectAllComments,
    clearSelectedComments,
    updateFilters,
    clearAllFilters,
    archiveComments,
    flagComment,
    markCommentAsImportant,
    deleteComment,
    saveCommentForLater,
  } = useCommentsStore()

  return {
    setComments,
    setSelectedComment,
    setIsPreviewOpen,
    setIsSidebarOpen,
    toggleExpandComment,
    toggleExpandReply,
    toggleCommentSelection,
    selectAllComments,
    clearSelectedComments,
    updateFilters,
    clearAllFilters,
    archiveComments,
    flagComment,
    markCommentAsImportant,
    deleteComment,
    saveCommentForLater,
  }
}
