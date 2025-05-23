"use client"

import { ReplyDialog } from "@/components/dashboard/reply-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import {
    AlertTriangle,
    Archive,
    BookmarkIcon,
    Check,
    CheckCircle,
    CheckSquare,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    Filter,
    Flag,
    MessageSquare,
    MoreHorizontal,
    Reply,
    Search,
    Square,
    Star,
    ThumbsUp,
    Trash,
    X,
    Zap,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

// Mock replies data
const mockReplies = {
  comment1: [
    {
      id: "reply1",
      text: "Thank you for your feedback! We're working on improving that feature in our next update.",
      author: {
        name: "PulsePilot Support",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "1 hour ago",
      likes: 3,
      isOfficial: true,
    },
    {
      id: "reply2",
      text: "I've had the same issue. Hope they fix it soon!",
      author: {
        name: "Jane Cooper",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "45 minutes ago",
      likes: 1,
    },
  ],
  comment3: [
    {
      id: "reply3",
      text: "We appreciate your enthusiasm! The new dashboard will be available to all users next week.",
      author: {
        name: "PulsePilot Support",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "3 hours ago",
      likes: 5,
      isOfficial: true,
    },
  ],
  comment7: [
    {
      id: "reply4",
      text: "Thanks for reporting this. Our team is investigating the issue.",
      author: {
        name: "PulsePilot Support",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "2 hours ago",
      likes: 2,
      isOfficial: true,
    },
  ],
}

// Sort options
const sortOptions = [
  { id: "recent", label: "Recent", icon: <Clock className="mr-2 h-3.5 w-3.5" /> },
  { id: "oldest", label: "Oldest", icon: <Clock className="mr-2 h-3.5 w-3.5 rotate-180" /> },
  { id: "popular", label: "Popular", icon: <ThumbsUp className="mr-2 h-3.5 w-3.5" /> },
  { id: "unread", label: "Unread first", icon: <MessageSquare className="mr-2 h-3.5 w-3.5" /> },
]

// Embedded CommentReplies component
function CommentReplies({ commentId }: { commentId: string }) {
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate fetching replies
    const timer = setTimeout(() => {
      setReplies(mockReplies[commentId as keyof typeof mockReplies] || [])
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [commentId])

  return (
    <div className="space-y-2 py-1">
      {replies.length === 0 ? (
        <div className="text-center py-3 text-sm text-muted-foreground">No replies yet</div>
      ) : (
        replies.map((reply) => (
          <Card
            key={reply.id}
            className={`border-border/30 transition-all hover:border-border/60 ${reply.isOfficial ? "bg-primary/5" : ""}`}
          >
            <CardContent className="p-2">
              <div className="flex gap-2">
                <Avatar className="h-6 w-6 border border-border/60">
                  <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                  <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-xs">{reply.author.name}</span>
                      {reply.isOfficial && (
                        <Badge className="h-4 px-1 text-[9px] bg-primary/10 text-primary flex items-center gap-0.5">
                          <CheckCircle className="h-2 w-2" />
                          <span>Official</span>
                        </Badge>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground">{reply.time}</span>
                  </div>

                  <p className="text-xs leading-tight mb-1">{reply.text}</p>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      {/* Display likes count */}
                      <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.likes}</span>
                      </div>

                      <Button
                        size="sm"
                        className="h-5 px-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary text-[9px]"
                        onClick={() => {}}
                      >
                        <Reply className="h-2.5 w-2.5 mr-0.5" />
                        Reply
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={5} className="w-40 comment-menu">
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={(e) => {
                            e.preventDefault()
                          }}
                        >
                          <svg
                            className="mr-2 h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          <span>Copy text</span>
                        </DropdownMenuItem>
                        {reply.isOfficial ? (
                          <>
                            <DropdownMenuItem
                              className="text-xs"
                              onClick={(e) => {
                                e.preventDefault()
                              }}
                            >
                              <svg
                                className="mr-2 h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs text-destructive"
                              onClick={(e) => {
                                e.preventDefault()
                              }}
                            >
                              <svg
                                className="mr-2 h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            className="text-xs"
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            <svg
                              className="mr-2 h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span>Report</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

const platformColors = {
  youtube: "platform-badge-youtube",
  instagram: "platform-badge-instagram",
  twitter: "platform-badge-twitter",
  tiktok: "platform-badge-tiktok",
  facebook: "platform-badge-facebook",
  linkedin: "linkedin",
}

const platformIcons = {
  youtube: "/youtube.svg",
  instagram: "/instagram.svg",
  twitter: "/twitter.svg",
  tiktok: "/tiktok.svg",
  facebook: "/facebook.svg",
  linkedin: "/linkedin.svg",
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
  comments: initialComments,
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
  const [sortOption, setSortOption] = useState("recent")
  const [displayedComments, setDisplayedComments] = useState([...initialComments])
  const feedRef = useRef(null)
  const { toast } = useToast()

  // Helper function to convert time strings to minutes for sorting
  const parseTimeToMinutes = (timeStr) => {
    if (timeStr.includes("minute")) {
      return Number.parseInt(timeStr.split(" ")[0])
    } else if (timeStr.includes("hour")) {
      return Number.parseInt(timeStr.split(" ")[0]) * 60
    } else if (timeStr.includes("day")) {
      return Number.parseInt(timeStr.split(" ")[0]) * 60 * 24
    } else if (timeStr.includes("week")) {
      return Number.parseInt(timeStr.split(" ")[0]) * 60 * 24 * 7
    }
    return 0
  }

  // Function to apply filters and sorting
  const applyFiltersAndSort = useCallback(() => {
    let filteredComments = [...initialComments]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredComments = filteredComments.filter(
        (comment) =>
          comment.text.toLowerCase().includes(searchLower) || comment.author.name.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (filters.status && filters.status !== "all") {
      filteredComments = filteredComments.filter((comment) => {
        if (filters.status === "flagged") return comment.flagged
        if (filters.status === "attention") return comment.needsAttention
        if (filters.status === "archived") return comment.archived
        return true
      })
    }

    // Apply platform filters
    if (filters.platforms && filters.platforms.length > 0) {
      filteredComments = filteredComments.filter((comment) => filters.platforms.includes(comment.platform))
    }

    // Apply emotion filters
    if (filters.emotions && filters.emotions.length > 0) {
      filteredComments = filteredComments.filter((comment) => filters.emotions.includes(comment.emotion))
    }

    // Apply sentiment filters
    if (filters.sentiments && filters.sentiments.length > 0) {
      filteredComments = filteredComments.filter((comment) => filters.sentiments.includes(comment.sentiment))
    }

    // Apply category filters
    if (filters.categories && filters.categories.length > 0) {
      filteredComments = filteredComments.filter((comment) => filters.categories.includes(comment.category))
    }

    // Apply sorting
    const sortedComments = [...filteredComments]

    switch (sortOption) {
      case "recent":
        sortedComments.sort((a, b) => {
          const aTime = parseTimeToMinutes(a.time)
          const bTime = parseTimeToMinutes(b.time)
          return aTime - bTime
        })
        break
      case "oldest":
        sortedComments.sort((a, b) => {
          const aTime = parseTimeToMinutes(a.time)
          const bTime = parseTimeToMinutes(b.time)
          return bTime - aTime
        })
        break
      case "popular":
        sortedComments.sort((a, b) => b.likes - a.likes)
        break
      case "unread":
        sortedComments.sort((a, b) => {
          if (a.replies === 0 && b.replies > 0) return -1
          if (a.replies > 0 && b.replies === 0) return 1
          return 0
        })
        break
      default:
        break
    }

    setDisplayedComments(sortedComments)
  }, [filters, sortOption, initialComments])

  // Apply filters and sorting whenever filters or sort option changes
  useEffect(() => {
    applyFiltersAndSort()
  }, [applyFiltersAndSort])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!displayedComments.length) return

      // Find current index
      const currentIndex = selectedComment ? displayedComments.findIndex((c) => c.id === selectedComment.id) : -1

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIndex = currentIndex < displayedComments.length - 1 ? currentIndex + 1 : 0
        onCommentSelect(displayedComments[nextIndex])
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : displayedComments.length - 1
        onCommentSelect(displayedComments[prevIndex])
      } else if (e.key === "Enter" && document.activeElement.tagName !== "INPUT" && selectedComment) {
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
  }, [displayedComments, selectedComment, onCommentSelect, replyingTo])

  const handleReply = useCallback((comment) => {
    setReplyingTo(comment)
  }, [])

  const handleCloseReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault() // Prevent form submission
      onFilterChange({ ...filters, search: searchValue })
    },
    [searchValue, onFilterChange, filters],
  )

  const clearSearch = useCallback(() => {
    setSearchValue("")
    onFilterChange({ ...filters, search: "" })
  }, [onFilterChange, filters])

  const clearFilter = useCallback(
    (filterType, filterId) => {
      const currentFilters = filters[filterType] || []
      const newFilters = currentFilters.filter((id) => id !== filterId)
      onFilterChange({ ...filters, [filterType]: newFilters })
    },
    [filters, onFilterChange],
  )

  const clearAllFilters = useCallback(() => {
    onFilterChange({
      search: "",
      status: "",
      platforms: [],
      emotions: [],
      sentiments: [],
      categories: [],
    })
    setSearchValue("")
  }, [onFilterChange])

  const toggleCommentSelection = useCallback((commentId) => {
    setSelectedComments((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId)
      } else {
        return [...prev, commentId]
      }
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedComments((prev) => {
      if (prev.length === displayedComments.length) {
        return []
      } else {
        return displayedComments.map((comment) => comment.id)
      }
    })
  }, [displayedComments])

  const handleBulkReply = useCallback(() => {
    setBulkReplyOpen(true)
  }, [])

  const handleBulkArchive = useCallback(() => {
    // Show toast notification
    toast({
      title: "Comments Archived",
      description: `${selectedComments.length} comments have been archived.`,
      variant: "default",
    })
    setSelectedComments([])
  }, [selectedComments, toast])

  const handleBulkSaveForLater = useCallback(() => {
    // Show toast notification
    toast({
      title: "Comments Saved",
      description: `${selectedComments.length} comments have been saved for later.`,
      variant: "default",
    })
    setSelectedComments([])
  }, [selectedComments, toast])

  // Toggle expanded state for a comment
  const toggleExpandComment = useCallback((commentId) => {
    setExpandedComments((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId)
      } else {
        return [...prev, commentId]
      }
    })
  }, [])

  // Toggle expanded replies for a comment
  const toggleExpandReplies = useCallback((commentId, e) => {
    e.stopPropagation()
    setExpandedReplies((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId)
      } else {
        return [...prev, commentId]
      }
    })
  }, [])

  // Handle comment actions with toast notifications
  const handleCommentAction = useCallback(
    (action, commentId) => {
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
    },
    [toast],
  )

  // Handle sort option selection
  const handleSortChange = useCallback(
    (sortId) => {
      // Update the sort option state
      setSortOption(sortId)

      // Apply sorting directly to the current filtered comments
      const sortedComments = [...displayedComments]

      switch (sortId) {
        case "recent":
          sortedComments.sort((a, b) => {
            const aTime = parseTimeToMinutes(a.time)
            const bTime = parseTimeToMinutes(b.time)
            return aTime - bTime
          })
          break
        case "oldest":
          sortedComments.sort((a, b) => {
            const aTime = parseTimeToMinutes(a.time)
            const bTime = parseTimeToMinutes(b.time)
            return bTime - aTime
          })
          break
        case "popular":
          sortedComments.sort((a, b) => b.likes - a.likes)
          break
        case "unread":
          sortedComments.sort((a, b) => {
            if (a.replies === 0 && b.replies > 0) return -1
            if (a.replies > 0 && b.replies === 0) return 1
            return 0
          })
          break
        default:
          break
      }

      // Update the displayed comments with the sorted results
      setDisplayedComments(sortedComments)

      toast({
        title: "Comments sorted",
        description: `Sorted by ${sortOptions.find((opt) => opt.id === sortId)?.label}`,
        variant: "default",
      })
    },
    [displayedComments, toast],
  )

  // Define loadMoreComments before handleScroll
  const loadMoreComments = useCallback(() => {
    if (displayedComments.length >= 50) return // Don't load more if we already have 50 comments

    setIsLoading(true)
    // Simulate loading more comments
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [displayedComments.length])

  // Now handleScroll can safely reference loadMoreComments
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading) {
        loadMoreComments()
      }
    },
    [isLoading, loadMoreComments],
  )

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
              onKeyDown={(e) => {
                // Prevent Enter key from triggering reply
                if (e.key === "Enter") {
                  e.stopPropagation()
                }
              }}
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
                <span>Sort: {sortOptions.find((opt) => opt.id === sortOption)?.label}</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  className="flex items-center gap-1 text-xs cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSortChange(option.id)
                  }}
                  onSelect={(e) => {
                    e.preventDefault()
                  }}
                >
                  {option.icon}
                  {option.label}
                  {sortOption === option.id && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
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
              {selectedComments.length === displayedComments.length ? (
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
        {displayedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
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
                onToggleReplies={(e) => toggleExpandReplies(comment.id, e)}
                onAction={(action) => handleCommentAction(action, comment.id)}
                isMobile={isMobile}
                searchTerm={filters.search}
              />

              {/* Expanded Replies */}
              {expandedReplies.includes(comment.id) && (
                <div className="replies-container ml-8 pl-3 border-l-2 border-primary/20 dark:border-primary/30 mt-1 mb-1.5 animate-slide-down">
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
            platform: displayedComments.find((c) => selectedComments.includes(c.id))?.platform || "youtube",
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
  onToggleReplies,
  onAction,
  isMobile = false,
  onToggleExpand,
  searchTerm = "",
}) {
  const platformColors = {
    youtube: "platform-badge-youtube",
    instagram: "platform-badge-instagram",
    twitter: "platform-badge-twitter",
    tiktok: "platform-badge-tiktok",
    facebook: "platform-badge-facebook",
    linkedin: "linkedin",
  }

  const platformIcons = {
    youtube: "/youtube.svg",
    instagram: "/instagram.svg",
    twitter: "/twitter.svg",
    tiktok: "/tiktok.svg",
    facebook: "/facebook.svg",
    linkedin: "/linkedin.svg",
  }

  const emotionIcons = {
    excited: "🤩",
    angry: "😡",
    curious: "🤔",
    happy: "😊",
    sad: "😢",
    neutral: "😐",
  }

  const { toast } = useToast()

  // Check if comment text is long enough to need truncation
  const needsTruncation = comment.text.length > 180
  const displayText = isExpanded || !needsTruncation ? comment.text : comment.text.slice(0, 180) + "..."

  // Check if comment is AI-generated (for demo purposes)
  const isAiGenerated = comment.id === "comment1" || comment.id === "comment7" || comment.id === "comment4"

  // Highlight search term in text if present
  const highlightSearchTerm = (text, term) => {
    if (!term) return text

    const parts = text.split(new RegExp(`(${term})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const handleDropdownAction = (action) => {
    // Stop event propagation and prevent default behavior
    onAction(action)

    // Show toast notification for the action
    const actionMessages = {
      important: "Comment marked as important",
      flag: "Comment flagged for review",
      archive: "Comment archived",
      save: "Comment saved for later",
      delete: "Comment deleted",
    }

    toast({
      title: actionMessages[action] || "Action completed",
      description: `Comment ID: ${comment.id.substring(0, 8)}...`,
      variant: "default",
    })
  }

  const platformIcon = platformIcons[comment.platform] || "/placeholder.svg"

  return (
    <Card
      className={`comment-card-compact cursor-pointer transition-all hover:border-border/60 ${
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
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
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
                <span className="font-medium text-xs">
                  {searchTerm ? highlightSearchTerm(comment.author.name, searchTerm) : comment.author.name}
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="h-4 px-1 text-[9px] flex items-center gap-0.5">
                        <span>{emotionIcons[comment.emotion]}</span>
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

            <p className="text-xs leading-tight mb-1 line-clamp-2">
              {searchTerm ? highlightSearchTerm(displayText, searchTerm) : displayText}
            </p>

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
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDropdownAction("important")
                      }}
                    >
                      <Star className="mr-2 h-3 w-3 transition-colors group-hover:text-yellow-500" />
                      <span>Mark as important</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDropdownAction("flag")
                      }}
                    >
                      <Flag className="mr-2 h-3 w-3 transition-colors group-hover:text-red-500" />
                      <span>Flag comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDropdownAction("archive")
                      }}
                    >
                      <Archive className="mr-2 h-3 w-3" />
                      <span>Archive</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDropdownAction("save")
                      }}
                    >
                      <BookmarkIcon className="mr-2 h-3 w-3 transition-colors group-hover:text-blue-500" />
                      <span>Save for later</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs text-destructive group"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDropdownAction("delete")
                      }}
                    >
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
