"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { replyToComment } from "@/lib/api/commentsService";
import { useComments } from "@/lib/hooks/comments";
import type { Comment, CommentReply } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, MessageSquare, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useCommentsActions, useCommentsStore } from "../state/comments-store";
import { CommentCard } from "../ui/comment-card";
import { CommentReplies } from "../ui/comment-replies";

export default function CommentsFeedContainer() {
  // Reply sheet state
  const [replyingComment, setReplyingComment] = useState<Comment | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  // Read filter state from the store
  const filters = useCommentsStore((state) => state.filters);
  // Fetch comments via React Query
  const { data, isLoading, isError, error, refetch } = useComments("mock-team", {
    archived: filters.status === "archived",
    flagged: filters.status === "flagged",
    page: 1,
    pageSize: 20,
  });
  // Memoize comments list
  const comments = useMemo(() => data?.items ?? [], [data?.items]);
  // Store state and actions
  const selectedComment = useCommentsStore((state) => state.selectedComment);
  const selectedComments = useCommentsStore((state) => state.selectedComments);
  const expandedComments = useCommentsStore((state) => state.expandedComments);
  const expandedReplies = useCommentsStore((state) => state.expandedReplies);
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
  } = useCommentsActions();
  // Local UI state
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const listRef = useRef<any>(null);
  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      keys: { key: "ArrowDown" },
      handler: () => {
        if (!comments.length) return;
        const currentIndex = selectedComment
          ? comments.findIndex((c) => c.id === selectedComment.id)
          : -1;
        const nextIndex = currentIndex < comments.length - 1 ? currentIndex + 1 : 0;
        setSelectedComment(comments[nextIndex]!);

        // Scroll to the selected comment
        if (listRef.current) {
          listRef.current.scrollToItem(nextIndex, "center");
        }
      },
    },
    {
      keys: { key: "ArrowUp" },
      handler: () => {
        if (!comments.length) return;
        const currentIndex = selectedComment
          ? comments.findIndex((c) => c.id === selectedComment.id)
          : -1;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : comments.length - 1;
        setSelectedComment(comments[prevIndex]!);

        // Scroll to the selected comment
        if (listRef.current) {
          listRef.current.scrollToItem(prevIndex, "center");
        }
      },
    },
  ]);

  // Handle comment actions
  const handleCommentAction = useCallback(
    (action: string, commentId: string) => {
      const actionMessages = {
        flag: "Comment flagged for review",
        archive: "Comment archived",
        save: "Comment saved for later",
        delete: "Comment deleted",
        important: "Comment marked as important",
      };

      switch (action) {
        case "flag":
          flagComment(commentId, true);
          break;
        case "archive":
          archiveComments([commentId]);
          break;
        case "save":
          saveCommentForLater(commentId);
          break;
        case "delete":
          deleteComment(commentId);
          break;
        case "important":
          markCommentAsImportant(commentId);
          break;
      }

      toast({
        title: actionMessages[action as keyof typeof actionMessages] || "Action completed",
        description: `Comment ID: ${commentId.substring(0, 8)}...`,
      });
    },
    [
      flagComment,
      archiveComments,
      saveCommentForLater,
      deleteComment,
      markCommentAsImportant,
      toast,
    ]
  );

  // Handle reply to comment
  const handleReply = useCallback((comment: Comment) => {
    setReplyingComment(comment);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };

  // Clear search
  const clearSearch = () => {
    setSearchValue("");
    updateFilters({ search: "" });
  };

  // Scroll to selected comment when it changes
  useEffect(() => {
    if (selectedComment && listRef.current) {
      const index = comments.findIndex((c) => c.id === selectedComment.id);
      if (index !== -1) {
        listRef.current.scrollToItem(index, "center");
      }
    }
  }, [selectedComment, comments]);

  // Handle infinite loading
  const isItemLoaded = (index: number) => index < comments.length;
  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    // In a real app, this would load more comments from an API
    return Promise.resolve();
  };

  // Reply mutation
  const { mutate: sendReply, isPending: isReplying } = useMutation<CommentReply, Error, string>({
    mutationFn: (message: string) => replyToComment("mock-team", replyingComment!.id, { message }),
    onSuccess: () => {
      toast({ title: "Reply sent", description: "Your reply was posted successfully." });
      setReplyMessage("");
      setReplyingComment(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending reply",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setReplyMessage("");
      setReplyingComment(null);
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-2">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="text-red-600">Error loading comments: {error?.message}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  // Empty state
  if (comments.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-2">
        <MessageSquare className="text-muted-foreground h-8 w-8" />
        <p>No comments found</p>
      </div>
    );
  }

  // Row renderer for virtualized list
  const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const comment = comments[index];
    if (!comment) return null;

    const isSelected = selectedComment?.id === comment.id;
    const isChecked = selectedComments.includes(comment.id);
    const isExpanded = expandedComments.includes(comment.id);
    const isRepliesExpanded = expandedReplies.includes(comment.id);

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
              e.stopPropagation();
              toggleExpandReply(comment.id);
            }}
            onAction={(action) => handleCommentAction(action, comment.id)}
            isMobile={isMobile}
          />

          {/* Expanded Replies */}
          {isRepliesExpanded && (
            <div className="replies-container border-primary/20 dark:border-primary/30 mt-1 mb-1.5 ml-8 border-l-2 pl-3">
              <CommentReplies commentId={comment.id} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col">
        {/* Search Bar */}
        <div className="bg-background/95 border-border/30 sticky top-0 z-20 border-b p-2 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder="Search comments..."
              className="bg-background border-border/60 h-8 pr-8 pl-8 text-xs"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
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
                {({ onItemsRendered, ref }: any) => (
                  <List
                    ref={(list: any) => {
                      ref(list);
                      listRef.current = list;
                    }}
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

        {/* Reply Sheet */}
        <Sheet
          open={Boolean(replyingComment)}
          onOpenChange={(open) => {
            if (!open) setReplyingComment(null);
          }}
        >
          <SheetContent
            side={isMobile ? "bottom" : "right"}
            className={isMobile ? "h-[50%]" : "w-[40%] p-4"}
          >
            <SheetHeader>
              <SheetTitle>Reply to {replyingComment?.author.name}</SheetTitle>
              <SheetDescription>Write and send your reply.</SheetDescription>
            </SheetHeader>
            <Textarea
              className="mt-2"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
            />
            <SheetFooter className="mt-4 flex justify-end">
              <Button
                onClick={() => sendReply(replyMessage)}
                disabled={!replyMessage || isReplying}
              >
                {isReplying ? <LoadingSpinner size="sm" /> : "Send Reply"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </ErrorBoundary>
  );
}
