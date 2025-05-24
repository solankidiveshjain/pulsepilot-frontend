"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage as next/image is used
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { emotionInfo, platformInfo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Comment, Platform } from "@/types";
import {
  AlertTriangle,
  Archive as ArchiveIcon, // Renamed to avoid conflict if 'Archive' is used as a component elsewhere
  BookmarkIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Reply,
  Star,
  ThumbsUp,
  Trash,
  Zap,
} from "lucide-react";
import Image from "next/image";
import * as React from "react"; // Changed to import * as React
import { memo, useState } from "react"; // Added useState for likeAnim

// Define CommentAction type
export type CommentAction = "flag" | "archive" | "save" | "delete" | "important";

interface CommentCardProps {
  comment: Comment;
  isSelected: boolean;
  isChecked: boolean;
  isExpanded: boolean;
  isRepliesExpanded: boolean;
  onSelect: () => void;
  onReply: () => void;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onToggleReplies: (e: React.MouseEvent) => void;
  onAction: (action: CommentAction) => void; // Updated prop type
  isMobile?: boolean;
  searchTerm?: string; // Added searchTerm prop
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
    )
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
  const needsTruncation = comment.text.length > 180;
  const displayText =
    isExpanded || !needsTruncation ? comment.text : comment.text.slice(0, 180) + "...";

  // Check if comment is AI-generated (for demo purposes)
  const isAiGenerated =
    comment.id === "comment1" || comment.id === "comment7" || comment.id === "comment4";

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
  // Local animation state for Replies button
  const [replyAnim, setReplyAnim] = useState(false);
  const handleRepliesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setReplyAnim(true);
    onToggleReplies(e);
    setTimeout(() => setReplyAnim(false), 300);
  };
  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);
  };

  return (
    <Card
      className={cn(
        "comment-card-compact group hover:border-primary hover:bg-muted/5 focus-visible:ring-primary cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none",
        isSelected ? "comment-card-selected active-comment border-primary" : ""
      )}
      onClick={onSelect}
    >
      <CardContent className="p-1">
        {" "}
        {/* p-1 to match inline card */}
        <div className="flex gap-2">
          {/* Left column: Selection & thumbnail (changed from w-8 to w-12 to match inline) */}
          <div className="flex w-12 flex-shrink-0 flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 rounded-sm p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
            >
              {isChecked ? (
                <svg
                  className="text-primary h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
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
            <Avatar className="border-border/60 h-6 w-6 border">
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
            <div className="group-hover:ring-primary relative h-8 w-8 overflow-hidden rounded-md transition-all group-hover:ring-2">
              <Image
                src={comment.postThumbnail} // Assuming postThumbnail is available in Comment type
                alt={comment.postTitle} // Assuming postTitle is available
                fill
                className="object-cover"
              />
              <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md">
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
          <div className="max-w-full flex-1">
            <div className="mb-0 flex items-start justify-between">
              {" "}
              {/* mb-0 to match inline card */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium">
                  {highlightSearchTerm(comment.author.name, searchTerm)}
                </span>
                <TooltipProvider delayDuration={300}>
                  {" "}
                  {/* Added delayDuration */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="flex h-4 items-center gap-0.5 px-1 text-[9px]">
                        <span>{emotionIcon}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {comment.emotion.charAt(0).toUpperCase() + comment.emotion.slice(1)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {isAiGenerated && (
                  <Badge className="ai-pulse flex h-4 items-center gap-0.5 bg-purple-500/10 px-1 text-[9px] text-purple-500">
                    <Zap className="h-2 w-2" />
                    <span>AI</span>
                  </Badge>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground flex items-center gap-1 text-[9px]">
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
            <div className="text-muted-foreground group-hover:text-primary mb-0.5 truncate text-[10px] font-semibold transition-colors">
              {comment.postTitle}
            </div>
            <p className="mb-0.5 line-clamp-1 text-[10px] leading-tight">
              {" "}
              {/* mb-0.5 and line-clamp-1 from inline card */}
              {highlightSearchTerm(displayText, searchTerm)}
            </p>

            {needsTruncation &&
              !isExpanded && ( // Added !isExpanded to match inline card logic
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/5 h-5 px-1 py-0 text-[9px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand();
                  }}
                >
                  {isExpanded ? "Show less" : "See more"}
                  <ChevronRight
                    className={`ml-0.5 h-2.5 w-2.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  />
                </Button>
              )}

            <div className="mt-1 flex items-center justify-between">
              {" "}
              {/* Removed flex-wrap and gap-1 */}
              <div className="flex items-center gap-6">
                {" "}
                {/* gap-6 from inline card */}
                <button // Changed from div to button, added animation classes
                  className={`flex items-center gap-2 text-[10px] transition-colors duration-300 ease-out ${likeAnim ? "text-primary scale-125" : "text-muted-foreground"} hover:text-primary hover:bg-primary/10 focus-visible:ring-primary rounded-md p-1 focus-visible:ring-2 focus-visible:outline-none`}
                  onClick={handleLikeClick}
                >
                  <ThumbsUp className="h-4 w-4" /> {/* h-4 w-4 from inline card */}
                  <span>{comment.likes}</span>
                </button>
                {comment.replies > 0 && (
                  <button // Replies button with animation
                    className={`flex items-center gap-2 text-[10px] transition-colors duration-300 ease-out ${replyAnim ? "text-primary scale-125" : "text-muted-foreground"} hover:text-primary hover:bg-primary/10 focus-visible:ring-primary rounded-md p-1 focus-visible:ring-2 focus-visible:outline-none`}
                    onClick={handleRepliesClick}
                  >
                    <MessageSquare className="h-4 w-4" /> {/* h-4 w-4 from inline card */}
                    <span>{comment.replies}</span>
                    {isRepliesExpanded ? (
                      <ChevronUp className="ml-0.5 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-0.5 h-4 w-4" />
                    )}
                  </button>
                )}
                <button // Changed from Button to button
                  className="text-primary flex items-baseline gap-2 text-[10px] transition-colors hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReply();
                  }}
                >
                  <Reply className="h-4 w-4" /> {/* h-4 w-4 from inline card */}
                  <span>Reply</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                {/* gap-2 from inline card */}
                {comment.flagged && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="destructive"
                          className="animate-pulse-slow h-4 px-1 text-[9px]"
                        >
                          <Flag className="mr-0.5 h-2.5 w-2.5" />{" "}
                          {/* Replaced SVG with Lucide Icon */}
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
                        <Badge className="animate-pulse-slow h-4 bg-yellow-500 px-1 text-[9px] hover:bg-yellow-600">
                          <AlertTriangle className="mr-0.5 h-2.5 w-2.5" />{" "}
                          {/* Replaced SVG with Lucide Icon */}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={5} className="comment-menu w-40">
                    <DropdownMenuItem
                      className="group text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownAction("important");
                      }}
                    >
                      <Star className="mr-2 h-3 w-3 transition-colors group-hover:text-yellow-500" />
                      <span>Mark as important</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="group text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownAction("flag");
                      }}
                    >
                      <Flag className="mr-2 h-3 w-3 transition-colors group-hover:text-red-500" />
                      <span>Flag comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="group text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownAction("archive");
                      }}
                    >
                      <ArchiveIcon className="mr-2 h-3 w-3" />
                      <span>Archive</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="group text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownAction("save");
                      }}
                    >
                      <BookmarkIcon className="mr-2 h-3 w-3 transition-colors group-hover:text-blue-500" />
                      <span>Save for later</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive group text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownAction("delete");
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
  );
}

// Memoize the component to prevent unnecessary re-renders
export const CommentCard = memo(CommentCardComponent);
