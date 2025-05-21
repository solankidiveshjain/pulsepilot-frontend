import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comments";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { CommentCard } from "../atoms/CommentCard";

interface CommentListProps {
  comments: Comment[];
  selectedCommentId?: string;
  onCommentSelect?: (comment: Comment) => void;
  className?: string;
}

const ITEM_HEIGHT = 180; // Approximate height of a CommentCard

export const CommentList = React.memo(function CommentList({
  comments,
  selectedCommentId,
  onCommentSelect,
  className,
}: CommentListProps) {
  const Row = React.useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const comment = comments[index];
      if (!comment) return null;

      return (
        <div style={style}>
          <CommentCard
            comment={comment}
            isSelected={comment.id === selectedCommentId}
            onClick={() => onCommentSelect?.(comment)}
            className="mx-4 mb-4"
          />
        </div>
      );
    },
    [comments, selectedCommentId, onCommentSelect]
  );

  if (comments.length === 0) {
    return (
      <div className={cn("flex h-full items-center justify-center", className)}>
        <p className="text-muted-foreground">No comments found</p>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={comments.length}
            itemSize={ITEM_HEIGHT}
            overscanCount={3}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
});
