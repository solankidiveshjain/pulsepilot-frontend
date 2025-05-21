import { cn } from "@/lib/utils";

interface CommentSkeletonProps {
  className?: string;
}

export function CommentSkeleton({ className }: CommentSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="flex items-start space-x-4">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
      </div>
    </div>
  );
}

export function CommentListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}
