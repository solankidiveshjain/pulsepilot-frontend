"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar" // Removed AvatarImage as next/image is used
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { emotionInfo, platformInfo } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Comment, Platform } from "@/types"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MessageSquare,
  Reply,
  ThumbsUp,
  Zap,
  Star,
  Flag,
  Archive as ArchiveIcon, // Renamed to avoid conflict if 'Archive' is used as a component elsewhere
  BookmarkIcon,
  Trash,
  MoreHorizontal, // Added for the dropdown trigger
} from "lucide-react"
import Image from "next/image"
import * as React from "react" // Changed to import * as React
import { memo, useState } from "react" // Added useState for likeAnim

// Define CommentAction type
export type CommentAction = "flag" | "archive" | "save" | "delete" | "important";

interface CommentCardProps {
  comment: Comment
  isSelected: boolean
  isChecked: boolean
  isExpanded: boolean
  isRepliesExpanded: boolean
  onSelect: () => void
  onReply: () => void
  onToggleSelect: () => void
  onToggleExpand: () => void
  onToggleReplies: (e: React.MouseEvent) => void
  onAction: (action: CommentAction) => void // Updated prop type
  isMobile?: boolean
  searchTerm?: string // Added searchTerm prop
}

// Highlight search term utility function (copied from comments-feed.tsx)
const highlightSearchTerm = (text: string, term?: string): React.ReactNode => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, "gi");
  const parts = text.split(regex);
  return parts.map((part: string, i: number) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

function CommentCardComponent({
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
  searchTerm = "", // Default to empty string
}: CommentCardProps) {
  const { toast } = useToast(); // Initialize useToast

  const platformIcon = platformInfo[comment.platform as Platform]?.icon || "/placeholder.svg"; // Simplified
  const emotionIcon = emotionInfo[comment.emotion]?.icon || "😐";

  // Check if comment text is long enough to need truncation
  const needsTruncation = comment.text.length > 180
  const displayText = isExpanded || !needsTruncation ? comment.text : comment.text.slice(0, 180) + "..."

  // Check if comment is AI-generated (for demo purposes)
  const isAiGenerated = comment.id === "comment1" || comment.id === "comment7" || comment.id === "comment4"

  const componentActionMessages: Record<CommentAction, string> = {
    important: "Comment marked as important",
    flag: "Comment flagged for review",
    archive: "Comment archived",
    save: "Comment saved for later",
    delete: "Comment deleted",
  };

  const handleDropdownAction = (action: CommentAction) => {
    onAction(action);
    toast({
      title: componentActionMessages[action] || "Action completed",
      description: `Comment ID: ${comment.id.substring(0, 8)}...`,
      variant: "default",
    });
  };
  
  // Local animation state for Like button (copied from comments-feed.tsx's CommentCard)
  const [likeAnim, setLikeAnim] = useState(false);
  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);
  };

  return (
    <Card
      className={cn(
        "comment-card-compact group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-primary", // Added hover effects from inline card
        isSelected ? "comment-card-selected active-comment border-primary" : "" // Added active styles from inline card
      )}
      onClick={onSelect}
    >
      <CardContent className="p-1"> {/* p-1 to match inline card */}
        <div className="flex gap-2">
          {/* Left column: Selection & thumbnail (changed from w-8 to w-12 to match inline) */}
          <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 rounded-sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect()
              }}
            >
              {isChecked ? (
                <svg
                  className="h-3 w-3 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2" />
                </svg>
              )}
            </Button>
            <Avatar className="h-6 w-6 border border-border/60">
              <Image
                src={comment.author.avatar || "/placeholder.svg"} 
                alt={comment.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {/* Platform icon replaced by post thumbnail section from inline card */}
            <div className="relative w-8 h-8 overflow-hidden rounded-md group-hover:ring-2 group-hover:ring-primary transition-all">
              <Image
                src={comment.postThumbnail} // Assuming postThumbnail is available in Comment type
                alt={comment.postTitle} // Assuming postTitle is available
                fill
                className="object-cover"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                <Image
                  src={platformIcon}
                  alt={comment.platform}
                  width={12}
                  height={12}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 max-w-full">
            <div className="flex items-start justify-between mb-0"> {/* mb-0 to match inline card */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-xs">
                  {highlightSearchTerm(comment.author.name, searchTerm)}
                </span>
                <TooltipProvider delayDuration={300}> {/* Added delayDuration */}
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
                    {comment.timeTooltip || comment.time} 
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Video title tagline (from inline card) */}
            <div className="text-[10px] font-semibold text-muted-foreground mb-0.5 truncate transition-colors group-hover:text-primary">
              {comment.postTitle}
            </div>
            <p className="text-[10px] leading-tight mb-0.5 line-clamp-1"> {/* mb-0.5 and line-clamp-1 from inline card */}
              {highlightSearchTerm(displayText, searchTerm)}
            </p>

            {needsTruncation && !isExpanded && ( // Added !isExpanded to match inline card logic
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

            <div className="flex items-center justify-between mt-1"> {/* Removed flex-wrap and gap-1 */}
              <div className="flex items-center gap-6"> {/* gap-6 from inline card */}
                 <button // Changed from div to button, added animation classes
                  className={`flex items-baseline gap-2 text-[10px] transition-colors ${likeAnim ? 'text-primary scale-125' : 'text-muted-foreground'} hover:text-primary duration-300 ease-out`}
                  onClick={handleLikeClick}
                >
                  <ThumbsUp className="h-4 w-4" /> {/* h-4 w-4 from inline card */}
                  <span>{comment.likes}</span>
                </button>

                {comment.replies > 0 && (
                  <button // Changed from Button to button
                    className="flex items-baseline gap-2 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                    onClick={onToggleReplies}
                  >
                    <MessageSquare className="h-4 w-4" /> {/* h-4 w-4 from inline card */}
                    <span>{comment.replies}</span>
                    {isRepliesExpanded ? <ChevronUp className="h-4 w-4 ml-0.5" /> : <ChevronDown className="h-4 w-4 ml-0.5" />}
                  </button>
                )}

                <button // Changed from Button to button
                  className="flex items-baseline gap-2 text-[10px] text-primary hover:underline transition-colors"
                  onClick={(e) => { e.stopPropagation(); onReply(); }}
                >
                  <Reply className="h-4 w-4" /> {/* h-4 w-4 from inline card */}
                  <span>Reply</span>
                </button>
              </div>

              <div className="flex items-center gap-2"> {/* gap-2 from inline card */}
                {comment.flagged && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="text-[9px] h-4 px-1 animate-pulse-slow">
                          <Flag className="h-2.5 w-2.5 mr-0.5" /> {/* Replaced SVG with Lucide Icon */}
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
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="text-[9px] bg-yellow-500 hover:bg-yellow-600 h-4 px-1 animate-pulse-slow">
                          <AlertTriangle className="h-2.5 w-2.5 mr-0.5" /> {/* Replaced SVG with Lucide Icon */}
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
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownAction("important"); }}
                    >
                      <Star className="mr-2 h-3 w-3 transition-colors group-hover:text-yellow-500" />
                      <span>Mark as important</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownAction("flag"); }}
                    >
                      <Flag className="mr-2 h-3 w-3 transition-colors group-hover:text-red-500" />
                      <span>Flag comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownAction("archive"); }}
                    >
                      <ArchiveIcon className="mr-2 h-3 w-3" />
                      <span>Archive</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs group"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownAction("save"); }}
                    >
                      <BookmarkIcon className="mr-2 h-3 w-3 transition-colors group-hover:text-blue-500" />
                      <span>Save for later</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs text-destructive group"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownAction("delete"); }}
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

// Memoize the component to prevent unnecessary re-renders
export const CommentCard = memo(CommentCardComponent)
