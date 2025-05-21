"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Comment } from "@/lib/types/comments";
import { Archive, Eye, Flag, Heart, MessageSquare, ThumbsUp } from "lucide-react";
import NextImage from "next/image";
import { memo } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface CommentCardProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onFlag?: (commentId: string) => void;
  onArchive?: (commentId: string) => void;
  isLoading?: boolean;
}

const CommentMetrics = memo(function CommentMetrics({ metrics }: { metrics: Comment["metrics"] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <ThumbsUp className="h-4 w-4" aria-hidden="true" />
        <span>{metrics.likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span>{metrics.replies}</span>
      </div>
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" aria-hidden="true" />
        <span>{metrics.views}</span>
      </div>
    </div>
  );
});

const CommentActions = memo(function CommentActions({
  commentId,
  onLike,
  onFlag,
  onArchive,
}: {
  commentId: string;
  onLike?: (commentId: string) => void;
  onFlag?: (commentId: string) => void;
  onArchive?: (commentId: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Like comment"
        onClick={() => onLike?.(commentId)}
        className="focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <Heart className="h-4 w-4 text-brand-primary" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Flag comment"
        onClick={() => onFlag?.(commentId)}
        className="focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <Flag className="h-4 w-4 text-yellow-500" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Archive comment"
        onClick={() => onArchive?.(commentId)}
        className="focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <Archive className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </Button>
    </div>
  );
});

const CommentHeader = memo(function CommentHeader({
  author,
  createdAt,
}: {
  author: Comment["author"];
  createdAt: string;
}) {
  return (
    <div>
      <h3 className="truncate text-lg font-semibold text-foreground">{author.name}</h3>
      <p className="text-xs text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
});

export function CommentCard({ comment, onLike, onFlag, onArchive, isLoading }: CommentCardProps) {
  if (isLoading) {
    return <div className="h-32 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <ErrorBoundary fallback={<div>Error loading comment</div>}>
      <Card className="mb-4 rounded-xl border bg-card shadow-sm transition focus-within:ring-2 focus-within:ring-brand-primary hover:shadow-md">
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <NextImage
            src={comment.author.avatar}
            alt={comment.author.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border object-cover shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CommentHeader author={comment.author} createdAt={comment.createdAt} />
              <CommentActions
                commentId={comment.id}
                onLike={onLike}
                onFlag={onFlag}
                onArchive={onArchive}
              />
            </div>
            <p className="mt-2 break-words text-sm text-foreground">{comment.content}</p>
            <CommentMetrics metrics={comment.metrics} />
          </div>
        </div>
      </Card>
    </ErrorBoundary>
  );
}
