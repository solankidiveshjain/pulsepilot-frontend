import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comments";
import { formatDistanceToNow } from "date-fns";
import { Archive, CheckCircle, Flag, MessageSquare, Share2, ThumbsUp } from "lucide-react";
import React from "react";

interface CommentDetailsProps {
  comment: Comment;
  onReply?: () => void;
  onArchive?: () => void;
  onFlag?: () => void;
  onResolve?: () => void;
  className?: string;
}

export const CommentDetails = React.memo(function CommentDetails({
  comment,
  onReply,
  onArchive,
  onFlag,
  onResolve,
  className,
}: CommentDetailsProps) {
  const { text, author, platform, createdAt, sentiment, status, metadata } = comment;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={`${author.name}'s avatar`} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="truncate font-medium">{author.name}</span>
            {metadata.isVerified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mb-4 text-foreground/90">{text}</p>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {platform}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", {
                "bg-green-100 text-green-800": sentiment === "positive",
                "bg-red-100 text-red-800": sentiment === "negative",
                "bg-gray-100 text-gray-800": sentiment === "neutral",
              })}
            >
              {sentiment}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", {
                "bg-yellow-100 text-yellow-800": status === "new",
                "bg-blue-100 text-blue-800": status === "in-progress",
                "bg-green-100 text-green-800": status === "resolved",
                "bg-gray-100 text-gray-800": status === "archived",
              })}
            >
              {status}
            </Badge>
          </div>
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {metadata.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {metadata.replies}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              {metadata.shares}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onReply} className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Reply
            </Button>
            {status !== "resolved" && (
              <Button variant="outline" size="sm" onClick={onResolve} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Resolve
              </Button>
            )}
            {status !== "archived" && (
              <Button variant="outline" size="sm" onClick={onArchive} className="flex-1">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onFlag} className="flex-1">
              <Flag className="mr-2 h-4 w-4" />
              Flag
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});
