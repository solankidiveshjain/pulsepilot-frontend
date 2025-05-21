import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comments";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import React from "react";

interface CommentCardProps {
  comment: Comment;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CommentCard = React.memo(function CommentCard({
  comment,
  isSelected = false,
  onClick,
  className,
}: CommentCardProps) {
  const { text, author, platform, createdAt, sentiment, status, metadata } = comment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        role="article"
        aria-current={isSelected ? "true" : undefined}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={cn(
          "cursor-pointer p-4 transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-primary",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
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
            <p className="mb-2 line-clamp-3 text-sm text-foreground/90">{text}</p>
            <div className="flex flex-wrap items-center gap-2">
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
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>👍 {metadata.likes}</span>
              <span>💬 {metadata.replies}</span>
              <span>🔄 {metadata.shares}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
