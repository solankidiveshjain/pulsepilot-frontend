"use client";

import { ReplyDialog } from "@/components/dashboard/reply-dialog";
// Input will be removed as it's now in FeedToolbar
import { CommentCard } from "@/components/comments/ui/comment-card";
import { useToast } from "@/hooks/use-toast";
import type {
  ActiveFilter,
  Category,
  Comment,
  Emotion,
  FilterState,
  Platform,
  Sentiment,
} from "@/types";
import { Clock, MessageSquare, ThumbsUp } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActiveFiltersBar } from "./active-filters-bar";
import { BulkActionsToolbar } from "./bulk-actions-toolbar"; // Import BulkActionsToolbar
import { CommentReplies } from "./comment-replies";
import { FeedToolbar } from "./feed-toolbar";

// Define specific action types
type CommentAction = "flag" | "archive" | "save" | "delete" | "important";

// Sort options
const sortOptions = [
  { id: "recent", label: "Recent", icon: <Clock className="mr-2 h-3.5 w-3.5" /> },
  { id: "oldest", label: "Oldest", icon: <Clock className="mr-2 h-3.5 w-3.5 rotate-180" /> },
  { id: "popular", label: "Popular", icon: <ThumbsUp className="mr-2 h-3.5 w-3.5" /> },
  { id: "unread", label: "Unread first", icon: <MessageSquare className="mr-2 h-3.5 w-3.5" /> },
];

// platformIcons and emotionIcons are kept as they are used by ActiveFiltersBar
// platformColors is removed as it was only used by the inline CommentCard

const platformIcons = {
  youtube: "/youtube.svg",
  instagram: "/instagram.svg",
  twitter: "/twitter.svg",
  tiktok: "/tiktok.svg",
  facebook: "/facebook.svg",
  linkedin: "/linkedin.svg",
};

const emotionIcons = {
  excited: "🤩",
  angry: "😡",
  curious: "🤔",
  happy: "😊",
  sad: "😢",
  neutral: "😐",
};

export function CommentsFeed({
  comments: initialComments,
  selectedComment,
  onCommentSelect,
  filters,
  onFilterChange,
  isMobile = false,
}: {
  comments: Comment[];
  selectedComment: Comment | null;
  onCommentSelect: (comment: Comment) => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  isMobile?: boolean;
}) {
  // State for managing which comment is currently being replied to.
  // Null if no reply composer is open.
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  // Stores an array of comment IDs that are selected for bulk actions.
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  // Controls the visibility of the dialog used for replying to multiple comments at once.
  const [bulkReplyOpen, setBulkReplyOpen] = useState(false);
  // Indicates if additional comments are being loaded, e.g., for infinite scrolling.
  const [isLoading, setIsLoading] = useState(false);
  // Tracks comment IDs whose full text is expanded (if truncated).
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  // Tracks comment IDs whose replies section is currently visible.
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  // Stores the current sorting criteria for the comments list (e.g., "recent", "popular").
  const [sortOption, setSortOption] = useState<string>("recent");
  const feedRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  /**
   * Converts human-readable time strings (e.g., "1 hour ago", "2 days ago")
   * into a numerical value in minutes for sorting purposes.
   */
  const parseTimeToMinutes = (timeStr: string): number => {
    if (timeStr.includes("minute")) {
      return Number.parseInt(timeStr.split(" ")[0]);
    } else if (timeStr.includes("hour")) {
      return Number.parseInt(timeStr.split(" ")[0]) * 60;
    } else if (timeStr.includes("day")) {
      return Number.parseInt(timeStr.split(" ")[0]) * 60 * 24;
    } else if (timeStr.includes("week")) {
      return Number.parseInt(timeStr.split(" ")[0]) * 60 * 24 * 7;
    }
    return 0;
  };

  const displayedComments = useMemo(() => {
    let filteredComments = [...initialComments];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredComments = filteredComments.filter(
        (comment) =>
          comment.text.toLowerCase().includes(searchLower) ||
          comment.author.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== "all") {
      filteredComments = filteredComments.filter((comment) => {
        if (filters.status === "flagged") return comment.flagged;
        if (filters.status === "attention") return comment.needsAttention;
        if (filters.status === "archived") return comment.archived;
        return true;
      });
    }

    // Apply platform filters
    if (filters.platforms && filters.platforms.length > 0) {
      filteredComments = filteredComments.filter((comment) =>
        filters.platforms.includes(comment.platform)
      );
    }

    // Apply emotion filters
    if (filters.emotions && filters.emotions.length > 0) {
      filteredComments = filteredComments.filter((comment) =>
        filters.emotions.includes(comment.emotion)
      );
    }

    // Apply sentiment filters
    if (filters.sentiments && filters.sentiments.length > 0) {
      filteredComments = filteredComments.filter((comment) =>
        filters.sentiments.includes(comment.sentiment)
      );
    }

    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
      filteredComments = filteredComments.filter((comment) =>
        filters.categories.includes(comment.category)
      );
    }

    // Apply sorting
    const sortedComments = [...filteredComments];
    switch (sortOption) {
      case "recent":
        sortedComments.sort((a, b) => {
          const aTime = parseTimeToMinutes(a.time);
          const bTime = parseTimeToMinutes(b.time);
          return aTime - bTime;
        });
        break;
      case "oldest":
        sortedComments.sort((a, b) => {
          const aTime = parseTimeToMinutes(a.time);
          const bTime = parseTimeToMinutes(b.time);
          return bTime - aTime;
        });
        break;
      case "popular":
        sortedComments.sort((a, b) => b.likes - a.likes);
        break;
      case "unread":
        sortedComments.sort((a, b) => {
          if (a.replies === 0 && b.replies > 0) return -1;
          if (a.replies > 0 && b.replies === 0) return 1;
          return 0;
        });
        break;
      default:
        break;
    }
    return sortedComments;
  }, [initialComments, filters, sortOption]);

  /**
   * useEffect hook for handling keyboard navigation within the comments feed.
   * Allows users to navigate between comments using ArrowUp/ArrowDown keys,
   * open the reply dialog for the selected comment using Enter,
   * and close the reply dialog using Escape.
   */
  useEffect(() => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!displayedComments.length) return;

      // Find current index
      const currentIndex = selectedComment
        ? displayedComments.findIndex((c) => c.id === selectedComment.id)
        : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = currentIndex < displayedComments.length - 1 ? currentIndex + 1 : 0;
        onCommentSelect(displayedComments[nextIndex]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : displayedComments.length - 1;
        onCommentSelect(displayedComments[prevIndex]);
      } else if (
        e.key === "Enter" &&
        typeof document !== "undefined" && // Add check for document
        document.activeElement?.tagName !== "INPUT" &&
        selectedComment
      ) {
        e.preventDefault();
        setReplyingTo(selectedComment);
      } else if (e.key === "Escape") {
        if (replyingTo) {
          e.preventDefault();
          setReplyingTo(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown as EventListener);
    return () => window.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [displayedComments, selectedComment, onCommentSelect, replyingTo]);

  const handleReply = useCallback((comment: Comment) => {
    setReplyingTo(comment);
  }, []);

  const handleCloseReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent form submission
      onFilterChange({ ...filters, search: searchValue });
    },
    [searchValue, onFilterChange, filters]
  );

  const clearSearch = useCallback(() => {
    setSearchValue("");
    onFilterChange({ ...filters, search: "" });
  }, [onFilterChange, filters]);

  const clearFilter = useCallback(
    (filterType: keyof FilterState, filterValue: string) => {
      const currentFilterValues = filters[filterType] as string[] | undefined;
      const newFilterValues = currentFilterValues
        ? currentFilterValues.filter((id: string) => id !== filterValue)
        : [];
      onFilterChange({ ...filters, [filterType]: newFilterValues });
    },
    [filters, onFilterChange]
  );

  const clearAllFilters = useCallback(() => {
    onFilterChange({
      search: "",
      status: "all",
      platforms: [],
      emotions: [],
      sentiments: [],
      categories: [],
    });
    setSearchValue("");
  }, [onFilterChange]);

  const toggleCommentSelection = useCallback((commentId: string) => {
    setSelectedComments((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedComments((prev) => {
      if (prev.length === displayedComments.length) {
        return [];
      } else {
        return displayedComments.map((comment) => comment.id);
      }
    });
  }, [displayedComments]);

  const handleBulkReply = useCallback(() => {
    setBulkReplyOpen(true);
  }, []);

  const handleBulkArchive = useCallback(() => {
    // Show toast notification
    toast({
      title: "Comments Archived",
      description: `${selectedComments.length} comments have been archived.`,
      variant: "default",
    });
    setSelectedComments([]);
  }, [selectedComments, toast]);

  const handleBulkSaveForLater = useCallback(() => {
    // Show toast notification
    toast({
      title: "Comments Saved",
      description: `${selectedComments.length} comments have been saved for later.`,
      variant: "default",
    });
    setSelectedComments([]);
  }, [selectedComments, toast]);

  // Toggle expanded state for a comment
  const toggleExpandComment = useCallback((commentId: string) => {
    setExpandedComments((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  }, []);

  // Toggle expanded replies for a comment
  const toggleExpandReplies = useCallback((commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReplies((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId);
      } else {
        return [...prev, commentId];
      }
    });
  }, []);

  // Define a type for actionMessages
  const actionMessages: Record<CommentAction, string> = {
    flag: "Comment flagged for review",
    archive: "Comment archived",
    save: "Comment saved for later",
    delete: "Comment deleted",
    important: "Comment marked as important",
  };

  // Handle comment actions with toast notifications
  const handleCommentAction = useCallback(
    (action: CommentAction, commentId: string) => {
      toast({
        title: actionMessages[action] || "Action completed",
        description: `Comment ID: ${commentId.substring(0, 8)}...`,
        variant: "default",
      });
    },
    [toast]
  );

  // Handle sort option selection
  const handleSortChange = useCallback(
    (sortId: string) => {
      setSortOption(sortId);
      // No longer need to manually setDisplayedComments here, useMemo will handle it.
      toast({
        title: "Comments sorted",
        description: `Sorted by ${sortOptions.find((opt) => opt.id === sortId)?.label}`,
        variant: "default",
      });
    },
    [toast] // displayedComments is removed from dependencies
  );

  // Define loadMoreComments before handleScroll
  /**
   * Placeholder function to simulate loading more comments for infinite scroll.
   * Currently, it just sets an isLoading state for 1.5 seconds.
   * It also has a hardcoded limit of not "loading" more if 50 comments are already displayed.
   */
  const loadMoreComments = useCallback(() => {
    if (displayedComments.length >= 50) return;

    setIsLoading(true);
    // Simulate loading more comments
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [displayedComments.length]);

  // Now handleScroll can safely reference loadMoreComments
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && loadMoreComments) {
        // Added null check for loadMoreComments
        loadMoreComments();
      }
    },
    [isLoading, loadMoreComments]
  );

  // Simulate loading more comments on scroll
  // const handleScroll = useCallback(
  //   (e) => {
  //     const { scrollTop, scrollHeight, clientHeight } = e.target
  //     if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading) {
  //       loadMoreComments()
  //     }
  //   },
  //   [isLoading, loadMoreComments],
  // )

  // const loadMoreComments = useCallback(() => {
  //   if (displayedComments.length >= 50) return // Don't load more if we already have 50 comments

  //   setIsLoading(true)
  //   // Simulate loading more comments
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 1500)
  // }, [displayedComments.length])

  // Transforms the `filters` prop into an array of `ActiveFilter` objects
  // suitable for display by the `ActiveFiltersBar` component.
  const activeFilters: ActiveFilter[] = [];

  if (filters.status && filters.status !== "all") {
    activeFilters.push({
      type: "status",
      id: filters.status, // id is already a string here (Status type)
      label: filters.status.charAt(0).toUpperCase() + filters.status.slice(1),
      // No icon for status type based on current structure
    });
  }

  filters.platforms?.forEach((platform: Platform) => {
    activeFilters.push({
      type: "platforms",
      id: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      icon: platformIcons[platform],
    });
  });

  filters.emotions?.forEach((emotion: Emotion) => {
    activeFilters.push({
      type: "emotions",
      id: emotion,
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      icon: emotionIcons[emotion],
    });
  });

  filters.sentiments?.forEach((sentiment: Sentiment) => {
    activeFilters.push({
      type: "sentiments",
      id: sentiment,
      label: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
      // No icon for sentiment type based on current structure
    });
  });

  filters.categories?.forEach((category: Category) => {
    activeFilters.push({
      type: "categories",
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      // No icon for category type based on current structure
    });
  });

  return (
    <div className="flex h-full flex-col" ref={feedRef}>
      <FeedToolbar
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearchSubmit={handleSearch}
        onClearSearch={clearSearch}
        sortOption={sortOption}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
      />

      <ActiveFiltersBar
        activeFilters={activeFilters}
        onClearFilter={clearFilter}
        onClearAllFilters={clearAllFilters}
      />

      <BulkActionsToolbar
        selectedCommentsCount={selectedComments.length}
        totalCommentsInFeed={displayedComments.length}
        onToggleSelectAll={toggleSelectAll}
        onBulkReply={handleBulkReply}
        onBulkArchive={handleBulkArchive}
        onBulkSaveForLater={handleBulkSaveForLater}
        onClearSelection={() => setSelectedComments([])}
        isMobile={isMobile}
      />

      {/* Comments Feed - Vertical Scroll Only */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2" onScroll={handleScroll}>
        {displayedComments.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <MessageSquare className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
            <h3 className="text-xl font-medium">No comments found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          displayedComments.map((comment) => (
            <div key={comment.id} className="comment-thread">
              <CommentCard
                comment={comment}
                isSelected={selectedComment?.id === comment.id}
                isChecked={selectedComments.includes(comment.id)}
                isExpanded={expandedComments.includes(comment.id)}
                isRepliesExpanded={expandedReplies.includes(comment.id)}
                onSelect={() => onCommentSelect(comment)}
                onReply={() => handleReply(comment)}
                onToggleSelect={() => toggleCommentSelection(comment.id)}
                onToggleExpand={() => toggleExpandComment(comment.id)}
                onToggleReplies={(e) => toggleExpandReplies(comment.id, e as React.MouseEvent)}
                onAction={(action) => handleCommentAction(action, comment.id)} // Standalone card uses CommentAction directly
                isMobile={isMobile}
                searchTerm={filters.search ?? ""}
              />

              {/* Expanded Replies */}
              {expandedReplies.includes(comment.id) && (
                <div className="replies-container border-primary/20 dark:border-primary/30 animate-slide-down animate-fade-in mt-1 mb-1.5 ml-[3.75rem] border-l-2 pl-3">
                  <CommentReplies commentId={comment.id} />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
          </div>
        )}
      </div>

      {replyingTo && (
        <ReplyDialog comment={replyingTo} onClose={handleCloseReply} selectedComments={[]} />
      )}

      {bulkReplyOpen &&
        (() => {
          const bulkReplyTargetComment = displayedComments.find((c) =>
            selectedComments.includes(c.id)
          );
          const platformForBulkReply = bulkReplyTargetComment?.platform || "youtube";

          // For bulk replies, a dummy/partial Comment object is constructed.
          // This provides necessary context (like platform) to the ReplyDialog
          // without representing a single, specific comment.
          return (
            <ReplyDialog
              comment={{
                id: `bulk-reply-${Date.now()}`,
                author: { name: "Multiple Recipients", avatar: "" },
                text: `Replying to ${selectedComments.length} comments`,
                platform: platformForBulkReply,
                time: new Date().toISOString(),
                likes: 0,
                replies: 0,
                flagged: false,
                needsAttention: false,
                archived: false,
                postId: "",
                postTitle: "",
                postThumbnail: "",
                emotion: "neutral",
                sentiment: "neutral",
                category: "general",
              }}
              onClose={() => {
                setBulkReplyOpen(false);
                setSelectedComments([]);
              }}
              isBulkReply={true}
              selectedComments={selectedComments}
            />
          );
        })()}
    </div>
  );
}
