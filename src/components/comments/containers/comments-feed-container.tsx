"use client"

import type React from "react"

import { useCommentsActions, useCommentsStore } from "@/components/comments/state/comments-store"
import { CommentCard } from "@/components/comments/ui/comment-card"
import { CommentReplies } from "@/components/comments/ui/comment-replies"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { useComments } from "@/lib/hooks/comments"
import type { Comment } from '@/types'
import { AlertTriangle, MessageSquare, Search, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList as List } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"

export default function CommentsFeedContainer() {
  // Read filter state from the store
  const filters = useCommentsStore((state) => state.filters)
  // Fetch comments via React Query
  const { data, isLoading, isError, error, refetch } = useComments("mock-team", {
    archived: filters.status === "archived",
    flagged: filters.status === "flagged",
    page: 1,
    pageSize: 20,
  })
  // Memoize comments list
  const comments = useMemo(() => data?.items ?? [], [data?.items])
  // Store state and actions
  const selectedComment = useCommentsStore((state) => state.selectedComment)
  const selectedComments = useCommentsStore((state) => state.selectedComments)
  const expandedComments = useCommentsStore((state) => state.expandedComments)
  const expandedReplies = useCommentsStore((state) => state.expandedReplies)
  const {
    setSelectedComment,
    toggleExpandComment,
    toggleExpandReply,
    toggleCommentSelection,
    archiveComments,
    flagComment,
    markCommentAsImportant,
    deleteComment,
    saveCommentForLater,
    updateFilters,
  } = useCommentsActions()
  // Local UI state
  const [searchValue, setSearchValue] = useState(filters.search || "")
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const listRef = useRef<any>(null)
  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      keys: { key: "ArrowDown" },
      handler: () => {
        if (!comments.length) return
        const currentIndex = selectedComment ? comments.findIndex((c) => c.id === selectedComment.id) : -1
        const nextIndex = currentIndex < comments.length - 1 ? currentIndex + 1 : 0
        setSelectedComment(comments[nextIndex]!)

        // Scroll to the selected comment
        if (listRef.current) {
          listRef.current.scrollToItem(nextIndex, "center")
        }
      },
    },
    {
      keys: { key: "ArrowUp" },
      handler: () => {
        if (!comments.length) return
        const currentIndex = selectedComment ? comments.findIndex((c) => c.id === selectedComment.id) : -1
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : comments.length - 1
        setSelectedComment(comments[prevIndex]!)

        // Scroll to the selected comment
        if (listRef.current) {
          listRef.current.scrollToItem(prevIndex, "center")
        }
      },
    },
  ])

  // Handle comment actions
  const handleCommentAction = useCallback(
    (action: string, commentId: string) => {
      const actionMessages = {
        flag: "Comment flagged for review",
        archive: "Comment archived",
        save: "Comment saved for later",
        delete: "Comment deleted",
        important: "Comment marked as important",
      }

      switch (action) {
        case "flag":
          flagComment(commentId, true)
          break
        case "archive":
          archiveComments([commentId])
          break
        case "save":
          saveCommentForLater(commentId)
          break
        case "delete":
          deleteComment(commentId)
          break
        case "important":
          markCommentAsImportant(commentId)
          break
      }

      toast({
        title: actionMessages[action as keyof typeof actionMessages] || "Action completed",
        description: `Comment ID: ${commentId.substring(0, 8)}...`,
      })
    },
    [flagComment, archiveComments, saveCommentForLater, deleteComment, markCommentAsImportant, toast],
  )

  // Handle reply to comment
  const handleReply = useCallback(
    (comment: Comment) => {
      // In a real app, this would open a reply dialog
      toast({
        title: "Reply Dialog",
        description: `Replying to ${comment.author.name}`,
      })
    },
    [toast],
  )

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchValue })
  }

  // Clear search
  const clearSearch = () => {
    setSearchValue("")
    updateFilters({ search: "" })
  }

  // Scroll to selected comment when it changes
  useEffect(() => {
    if (selectedComment && listRef.current) {
      const index = comments.findIndex((c) => c.id === selectedComment.id)
      if (index !== -1) {
        listRef.current.scrollToItem(index, "center")
      }
    }
  }, [selectedComment, comments])

  // Handle infinite loading
  const isItemLoaded = (index: number) => index < comments.length
  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    // In a real app, this would load more comments from an API
    return Promise.resolve()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="text-red-600">Error loading comments: {error?.message}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
        <p>No comments found</p>
      </div>
    )
  }

  // Row renderer for virtualized list
  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const comment = comments[index]
    if (!comment) return null

    const isSelected = selectedComment?.id === comment.id
    const isChecked = selectedComments.includes(comment.id)
    const isExpanded = expandedComments.includes(comment.id)
    const isRepliesExpanded = expandedReplies.includes(comment.id)

    return (
      <div style={style} className="px-2 py-1">
        <div className="comment-thread">
          <CommentCard
            comment={comment}
            isSelected={isSelected}
            isChecked={isChecked}
            isExpanded={isExpanded}
            isRepliesExpanded={isRepliesExpanded}
            onSelect={() => setSelectedComment(comment!)}
            onReply={() => handleReply(comment)}
            onToggleSelect={() => toggleCommentSelection(comment.id)}
            onToggleExpand={() => toggleExpandComment(comment.id)}
            onToggleReplies={(e) => {
              e.stopPropagation()
              toggleExpandReply(comment.id)
            }}
            onAction={(action) => handleCommentAction(action, comment.id)}
            isMobile={isMobile}
          />

          {/* Expanded Replies */}
          {isRepliesExpanded && (
            <div className="replies-container ml-8 pl-3 border-l-2 border-primary/20 dark:border-primary/30 mt-1 mb-1.5">
              <CommentReplies commentId={comment.id} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/30 p-2">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              className="pl-8 pr-8 h-8 bg-background border-border/60 text-xs"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </form>
        </div>

        {/* Virtualized List */}
        <div className="flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={comments.length + (isLoading ? 1 : 0)}
                loadMoreItems={loadMoreItems}
              >
                {( { onItemsRendered, ref }: any ) => (
                  <List
                    ref={(list: any) => { ref(list); listRef.current = list }}
                    height={height}
                    width={width}
                    itemCount={comments.length}
                    itemSize={120} // Adjust based on your comment card size
                    onItemsRendered={onItemsRendered}
                  >
                    {rowRenderer}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </div>

        {isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="md" />
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
