"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  MessageSquare,
  ThumbsUp,
  Flag,
  Clock,
  AlertTriangle,
  Search,
  X,
  ChevronDown,
  Reply,
  Archive,
  CheckSquare,
  Square,
  Filter,
  Trash,
  MoreHorizontal,
  Star,
  BookmarkIcon,
  ChevronRight,
  ChevronUp,
  Zap,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReplyDialog } from "@/components/dashboard/reply-dialog"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { CommentReplies } from "./comment-replies"

const platformColors = {
  youtube: "platform-badge-youtube",
  instagram: "platform-badge-instagram",
  twitter: "platform-badge-twitter",
  tiktok: "platform-badge-tiktok",
  facebook: "platform-badge-facebook",
  linkedin: "platform-badge-linkedin",
}

const platformIcons = {
  youtube: "/youtube.png",
  instagram: "/instagram.png",
  twitter: "/twitter.png",
  tiktok: "/tiktok.png",
  facebook: "/facebook.png",
  linkedin: "/linkedin.png",
}

const emotionIcons = {
  excited: "🤩",
  angry: "😡",
  curious: "🤔",
  happy: "😊",
  sad: "😢",
  neutral: "😐",
}

export function CommentsFeed({
  comments,
  selectedComment,
  onCommentSelect,
  filters,
  onFilterChange,
  isMobile = false,
}) {
  const [replyingTo, setReplyingTo] = useState(null)
  const [searchValue, setSearchValue] = useState(filters.search || "")
  const [selectedComments, setSelectedComments] = useState([])
  const [bulkReplyOpen, setBulkReplyOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedComments, setExpandedComments] = useState([])
  const [expandedReplies, setExpandedReplies] = useState([])
  const feedRef = useRef(null)
  const { toast } = useToast()

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!comments.length) return

      // Find current index
      const currentIndex = selectedComment ? comments.findIndex((c) => c.id === selectedComment.id) : -1

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIndex = currentIndex < comments.length - 1 ? currentIndex + 1 : 0
        onCommentSelect(comments[nextIndex])
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : comments.length - 1
        onCommentSelect(comments[prevIndex])
      } else if (e.key === "Enter" && selectedComment) {
        e.preventDefault()
        setReplyingTo(selectedComment)
      } else if (e.key === "Escape") {
        if (replyingTo) {
          e.preventDefault()
          setReplyingTo(null)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [comments, selectedComment, onCommentSelect, replyingTo])

  const handleReply = (comment) => {
    setReplyingTo(comment)
  }

  const handleCloseReply = () => {
    setReplyingTo(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onFilterChange({ search: searchValue })
  }

  const clearSearch = () => {
    setSearchValue("")
    onFilterChange({ search: "" })
  }

  const clearFilter = (filterType, filterId) => {
    const currentFilters = filters[filterType] || []
    const newFilters = currentFilters.filter((id) => id !== filterId)
    onFilterChange({ [filterType]: newFilters })
  }

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      status: "all",
      platforms: [],
      emotions: [],
      sentiments: [],
      categories: [],
    })
    setSearchValue("")
  }

  const toggleCommentSelection = (commentId) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter((id) => id !== commentId))
    } else {
      setSelectedComments([...selectedComments, commentId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([])
    } else {
      setSelectedComments(comments.map((comment) => comment.id))
    }
  }

  const handleBulkReply = () => {
    setBulkReplyOpen(true)
  }

  const handleBulkArchive = () => {
    // Show toast notification
    toast({
      title: "Comments Archived",
      description: `${selectedComments.length} comments have been archived.`,
      variant: "default",
    })
    setSelectedComments([])
  }

  const handleBulkSaveForLater = () => {
    // Show toast notification
    toast({
      title: "Comments Saved",
      description: `${selectedComments.length} comments have been saved for later.`,
      variant: "default",
    })
    setSelectedComments([])
  }

  // Toggle expanded state for a comment
  const toggleExpandComment = (commentId) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId))
    } else {
      setExpandedComments([...expandedComments, commentId])
    }
  }

  // Toggle expanded replies for a comment
  const toggleExpandReplies = (commentId, e) => {
    e.stopPropagation()
    if (expandedReplies.includes(commentId)) {
      setExpandedReplies(expandedReplies.filter((id) => id !== commentId))
    } else {
      setExpandedReplies([...expandedReplies, commentId])
    }
  }

  // Handle comment actions with toast notifications
  const handleCommentAction = (action, commentId) => {
    const actionMessages = {
      flag: "Comment flagged for review",
      archive: "Comment archived",
      save: "Comment saved for later",
      delete: "Comment deleted",
      important: "Comment marked as important",
    }

    toast({
      title: actionMessages[action] || "Action completed",
      description: `Comment ID: ${commentId.substring(0, 8)}...`,
      variant: "default",
    })
  }

  // Simulate loading more comments on scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading) {
      loadMoreComments()
    }
  }

  const loadMoreComments = () => {
    if (comments.length >= 50) return // Don't load more if we already have 50 comments

    setIsLoading(true)
    // Simulate loading more comments
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Get all active filters
  const activeFilters = []

  if (filters.status && filters.status !== "all") {
    activeFilters.push({
      type: "status",
      id: filters.status,
      label: filters.status.charAt(0).toUpperCase() + filters.status.slice(1),
    })
  }

  filters.platforms?.forEach((platform) => {
    const platformInfo = {
      type: "platforms",
      id: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      icon: platformIcons[platform],
    }
    activeFilters.push(platformInfo)
  })

  filters.emotions?.forEach((emotion) => {
    activeFilters.push({
      type: "emotions",
      id: emotion,
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      icon: emotionIcons[emotion],
    })
  })

  filters.sentiments?.forEach((sentiment) => {
    activeFilters.push({
      type: "sentiments",
      id: sentiment,
      label: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    })
  })

  filters.categories?.forEach((category) => {
    activeFilters.push({
      type: "categories",
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    })
  })

  return (
    <div className="h-full flex flex-col" ref={feedRef}>
      {/* Search and Sort Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/30 p-2">
        <div className="flex items-center justify-between gap-2">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <span>Sort</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Clock className="mr-2 h-3.5 w-3.5" />
                Recent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-3.5 w-3.5 rotate-180" />
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ThumbsUp className="mr-2 h-3.5 w-3.5" />
                Popular
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-3.5 w-3.5" />
                Unread first
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 animate-fade-in border-b border-border/30">
          <div className="flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-medium">Filters:</span>
          </div>

          {activeFilters.map((filter) => (
            <div key={`${filter.type}-${filter.id}`} className="filter-pill">
              {filter.icon &&
                (typeof filter.icon === "string" ? (
                  <span>{filter.icon}</span>
                ) : (
                  <div className="relative h-3 w-3">
                    <Image src={filter.icon || "/placeholder.svg"} alt={filter.label} fill className="object-contain" />
                  </div>
                ))}
              <span>{filter.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 ml-1 hover:bg-primary/20"
                onClick={() => clearFilter(filter.type, filter.id)}
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove {filter.label} filter</span>
              </Button>
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] h-5 px-1.5 hover:bg-primary/10"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedComments.length > 0 && (
        <div className="bulk-action-bar">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={toggleSelectAll}>
              {selectedComments.length === comments.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </Button>
            <span className="text-xs font-medium">{selectedComments.length} selected</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap" onClick={handleBulkReply}>
              <Reply className="mr-1 h-3.5 w-3.5" />
              Bulk Reply
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap" onClick={handleBulkArchive}>
              <Archive className="mr-1 h-3.5 w-3.5" />
              Archive
            </Button>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs whitespace-nowrap"
                onClick={handleBulkSaveForLater}
              >
                <BookmarkIcon className="mr-1 h-3.5 w-3.5" />
                Save for Later
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedComments([])}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Comments Feed - Vertical Scroll Only */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1" onScroll={handleScroll}>
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No comments found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          comments.map((comment) => (
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
                onToggleReplies={(e) => toggleExpandReplies(comment.id, e)}
                onAction={(action) => handleCommentAction(action, comment.id)}
                isMobile={isMobile}
              />

              {/* Expanded Replies */}
              {expandedReplies.includes(comment.id) && (
                <div className="replies-container ml-8 pl-3 border-l-2 border-primary/20 dark:border-primary/30 mt-1 mb-1.5">
                  <CommentReplies commentId={comment.id} />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
      </div>

      {replyingTo && <ReplyDialog comment={replyingTo} onClose={handleCloseReply} selectedComments={[]} />}

      {bulkReplyOpen && (
        <ReplyDialog
          comment={{
            text: `Replying to ${selectedComments.length} comments`,
            author: { name: "Multiple Recipients" },
            platform: comments.find((c) => selectedComments.includes(c.id))?.platform || "youtube",
          }}
          onClose={() => {
            setBulkReplyOpen(false)
            setSelectedComments([])
          }}
          isBulkReply={true}
          selectedComments={selectedComments}
        />
      )}
    </div>
  )
}

function CommentCard({
  comment,
  isSelected,
  isChecked,
  isExpanded,
  isRepliesExpanded,
  onSelect,
  onReply,
  onToggleSelect,
  onToggleExpand,
  onToggleReplies,
  onAction,
  isMobile = false,
}) {
  const platformClass = platformColors[comment.platform] || ""
  const platformIcon = platformIcons[comment.platform] || ""
  const emotionIcon = emotionIcons[comment.emotion] || "😐"

  // Check if comment text is long enough to need truncation
  const needsTruncation = comment.text.length > 180
  const displayText = isExpanded || !needsTruncation ? comment.text : comment.text.slice(0, 180) + "..."

  // Check if comment is AI-generated (for demo purposes)
  const isAiGenerated = comment.id === "comment1" || comment.id === "comment7" || comment.id === "comment4"

  return (
    <Card
      className={`comment-card-compact cursor-pointer transition-all ${
        isSelected ? "comment-card-selected active-comment" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-2">
        <div className="flex gap-2">
          {/* Left column: Selection checkbox, avatar, platform icon */}
          <div className="flex flex-col items-center gap-1 w-8">
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 rounded-sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect()
              }}
            >
              {isChecked ? <CheckSquare className="h-3 w-3 text-primary" /> : <Square className="h-3 w-3" />}
            </Button>
            <Avatar className="h-6 w-6 border border-border/60">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="relative h-3 w-3 platform-icon">
              <Image src={platformIcon || "/placeholder.svg"} alt={comment.platform} fill className="object-contain" />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 max-w-full">
            <div className="flex items-start justify-between mb-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-xs">{comment.author.name}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="h-4 px-1 text-[9px] flex items-center gap-0.5">
                        <span>{emotionIcon}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {comment.emotion.charAt(0).toUpperCase() + comment.emotion.slice(1)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isAiGenerated && (
                  <Badge className="h-4 px-1 text-[9px] bg-purple-500/10 text-purple-500 flex items-center gap-0.5 ai-pulse">
                    <Zap className="h-2 w-2" />
                    <span>AI</span>
                  </Badge>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <span>{comment.time}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {comment.time === "2 hours ago"
                      ? "Today at 1:45 PM"
                      : comment.time === "5 hours ago"
                        ? "Today at 10:30 AM"
                        : "Yesterday at 3:15 PM"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <p className="text-xs leading-tight mb-1 line-clamp-2">{displayText}</p>

            {needsTruncation && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1 py-0 text-[9px] text-primary hover:bg-primary/5"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand()
                }}
              >
                {isExpanded ? "Show less" : "See more"}
                <ChevronRight className={`h-2.5 w-2.5 ml-0.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </Button>
            )}

            <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                  <ThumbsUp className="h-2.5 w-2.5" />
                  <span>{comment.likes}</span>
                </div>

                {/* Replies button with expand/collapse functionality */}
                {comment.replies > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1.5 text-[9px] text-muted-foreground hover:text-primary hover:bg-primary/5 flex items-center gap-0.5"
                    onClick={onToggleReplies}
                  >
                    <MessageSquare className="h-2.5 w-2.5" />
                    <span>
                      {comment.replies} {comment.replies === 1 ? "reply" : "replies"}
                    </span>
                    {isRepliesExpanded ? (
                      <ChevronUp className="h-2.5 w-2.5 ml-0.5" />
                    ) : (
                      <ChevronDown className="h-2.5 w-2.5 ml-0.5" />
                    )}
                  </Button>
                )}

                <Button
                  size="sm"
                  className="h-5 px-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary text-[9px]"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReply()
                  }}
                >
                  <Reply className="h-2.5 w-2.5 mr-0.5" />
                  Reply
                </Button>
              </div>

              <div className="flex items-center gap-1">
                {comment.flagged && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="text-[9px] h-4 px-1 animate-pulse-slow">
                          <Flag className="h-2.5 w-2.5 mr-0.5" />
                          Flagged
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        This comment has been flagged for review
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {comment.needsAttention && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="text-[9px] bg-yellow-500 hover:bg-yellow-600 h-4 px-1 animate-pulse-slow">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                          Attention
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        This comment needs your attention
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={5} className="w-40 comment-menu">
                    <DropdownMenuItem className="text-xs group" onClick={() => onAction("important")}>
                      <Star className="mr-2 h-3 w-3 transition-colors group-hover:text-yellow-500" />
                      <span>Mark as important</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs group" onClick={() => onAction("flag")}>
                      <Flag className="mr-2 h-3 w-3 transition-colors group-hover:text-red-500" />
                      <span>Flag comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs group" onClick={() => onAction("archive")}>
                      <Archive className="mr-2 h-3 w-3" />
                      <span>Archive</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs group" onClick={() => onAction("save")}>
                      <BookmarkIcon className="mr-2 h-3 w-3 transition-colors group-hover:text-blue-500" />
                      <span>Save for later</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs text-destructive group" onClick={() => onAction("delete")}>
                      <Trash className="mr-2 h-3 w-3 transition-colors group-hover:text-red-600" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
