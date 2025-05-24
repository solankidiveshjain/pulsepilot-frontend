"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useReplies } from "@/lib/hooks/useReplies";
import { ThumbsUp } from "lucide-react";
import { memo } from "react";

interface CommentRepliesProps {
  commentId: string;
}

function CommentRepliesComponent({ commentId }: CommentRepliesProps) {
  const { data: replies = [], isLoading, isError } = useReplies("mock-team", commentId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-1.5 pl-8">
        <div className="from-primary/10 to-primary/5 shimmer-effect h-10 rounded-md bg-linear-to-r" />
        <div
          className="from-primary/10 to-primary/5 shimmer-effect h-10 rounded-md bg-linear-to-r"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="from-primary/10 to-primary/5 shimmer-effect h-10 rounded-md bg-linear-to-r"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive py-2 pl-8 text-center text-[10px]">
        Error loading replies
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="text-muted-foreground py-2 pl-8 text-center text-[10px]">
        No replies to this comment yet.
      </div>
    );
  }

  const gradientColors = [
    "from-blue-500/20 via-purple-500/20 to-pink-500/20",
    "from-green-500/20 via-teal-500/20 to-blue-500/20",
    "from-yellow-500/20 via-orange-500/20 to-red-500/20",
    "from-pink-500/20 via-purple-500/20 to-indigo-500/20",
    "from-indigo-500/20 via-blue-500/20 to-cyan-500/20",
  ];

  return (
    <div className="animate-fade-in space-y-1 pl-8">
      {replies.map((reply, index) => (
        <Card
          key={reply.id}
          className={`group border-border/40 animate-gradient-x bg-linear-to-r shadow-sm ${gradientColors[index % gradientColors.length]} hover:bg-muted/5 focus-visible:ring-primary cursor-pointer transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-2">
            <div className="flex gap-1.5">
              <Avatar className="border-border/60 h-5 w-5 border">
                <AvatarImage
                  src={reply.author.avatar || "/placeholder.svg"}
                  alt={reply.author.name}
                />
                <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-medium">{reply.author.name}</span>
                    {reply.author.isOwner && (
                      <span className="bg-primary/10 text-primary rounded-full px-1 py-0.5 text-[8px]">
                        You
                      </span>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground text-[8px]">{reply.time}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {reply.timeTooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="ultra-compact line-clamp-2 text-[10px]">{reply.text}</p>
                <div className="text-muted-foreground flex items-center gap-1 text-[8px]">
                  <ThumbsUp className="h-2 w-2" />
                  <span>{reply.likes}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const CommentReplies = memo(CommentRepliesComponent);
