"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { emotionInfo, platformInfo } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Comment, Platform } from "@/types"
import { ChevronDown, ChevronRight, ChevronUp, MessageSquare, Reply, ThumbsUp, Zap } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { memo } from "react"

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
  onAction: (action: string) => void
  isMobile?: boolean
}

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
}: CommentCardProps) {
  const platformClass = `platform-badge-${comment.platform}`
  const platformIcon = platformInfo[comment.platform as Platform]?.icon || ""
  const emotionIcon = emotionInfo[comment.emotion]?.icon || "😐"

  // Check if comment text is long enough to need truncation
  const needsTruncation = comment.text.length > 180
  const displayText = isExpanded || !needsTruncation ? comment.text : comment.text.slice(0, 180) + "..."

  // Check if comment is AI-generated (for demo purposes)
  const isAiGenerated = comment.id === "comment1" || comment.id === "comment7" || comment.id === "comment4"

  return (
    <Card
      className={cn(
        "comment-card-compact cursor-pointer transition-all",
        isSelected && "comment-card-selected active-comment",
      )}
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
                    {comment.timeTooltip || comment.time}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <p className="text-xs leading-tight mb-1 line-clamp-2 wrap-anywhere">{displayText}</p>

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
                          <svg
                            className="h-2.5 w-2.5 mr-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                            />
                          </svg>
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
                          <svg
                            className="h-2.5 w-2.5 mr-0.5"
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
                          Attention
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        This comment needs your attention
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Open dropdown menu
                  }}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                </Button>
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
