"use client";

import { CommentModel } from "@/components/comments/models/comment.model";
import { useCommentStore } from "@/components/comments/state/commentStore";
import { CommentFilters } from "@/components/comments/ui/CommentFilters";
import { CommentList } from "@/components/comments/ui/CommentList";
import { ErrorBoundary } from "@/components/error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useComments } from "@/hooks/comments/useComments";
import { Suspense } from "react";

interface CommentContainerProps {
  postId: string;
  title: string;
}

function CommentContainerContent({ postId, title }: CommentContainerProps) {
  const { data, isLoading, error } = useComments({ postId });
  const { filters, setFilters, resetFilters } = useCommentStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading comments: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const filteredComments = CommentModel.filterComments(data?.comments ?? [], filters);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CommentFilters
          postId={postId}
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />
        <div className="mt-4 h-[400px]">
          <CommentList postId={postId} comments={filteredComments} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}

export function CommentContainer(props: CommentContainerProps) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong loading comments</div>}>
      <Suspense
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <CommentContainerContent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
