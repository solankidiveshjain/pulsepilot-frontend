"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import { Comment } from "@/lib/types/comments";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FixedSizeList as List } from "react-window";
import { CommentCard } from "./CommentCard";

export interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onLike?: (commentId: string) => void;
  onFlag?: (commentId: string) => void;
  onArchive?: (commentId: string) => void;
}

const ITEM_SIZE = 180; // Increased for more spacious cards

function CommentListError({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="text-destructive">Error loading comments: {error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}

export function CommentList({ comments, isLoading, onLike, onFlag, onArchive }: CommentListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(400);
  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        setListHeight(Math.max(containerHeight, windowHeight * 0.6));
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [windowHeight]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center" role="status" aria-live="polite">
        <div className="animate-pulse text-muted-foreground">Loading comments…</div>
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="flex h-full items-center justify-center" role="status" aria-live="polite">
        <div className="text-muted-foreground">No comments found</div>
      </div>
    );
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const comment = comments[index];
    if (!comment) return null;

    return (
      <div style={style} className="px-1 sm:px-0">
        <CommentCard comment={comment} onLike={onLike} onFlag={onFlag} onArchive={onArchive} />
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={CommentListError}>
      <div ref={containerRef} className="h-full w-full" role="list" aria-label="Comments list">
        <List
          height={listHeight}
          itemCount={comments.length}
          itemSize={ITEM_SIZE}
          width="100%"
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent focus:outline-none"
        >
          {Row}
        </List>
      </div>
    </ErrorBoundary>
  );
}
