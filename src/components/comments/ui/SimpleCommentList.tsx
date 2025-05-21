import { Comment } from "../models";

interface SimpleCommentListProps {
  comments: Comment[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  selectedCommentIds: string[];
  onSelectComment: (commentId: string) => void;
  onViewFullPost: (postId: string) => void;
  className?: string;
}

export function SimpleCommentList({
  comments,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  selectedCommentIds,
  onSelectComment,
  onViewFullPost,
  className = "",
}: SimpleCommentListProps) {
  // When no comments are available
  if (comments.length === 0 && !isLoading) {
    return (
      <div className={`flex h-full flex-col items-center justify-center ${className}`}>
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">No comments found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or check back later.
          </p>
          <div className="mt-4 bg-yellow-100 p-3 text-sm text-yellow-800">
            <p>
              <strong>Debug:</strong> The comments array is empty.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading state
  if (comments.length === 0 && isLoading) {
    return (
      <div className={`flex h-full items-center justify-center ${className}`}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-muted-foreground">Loading comments...</span>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-6 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
        <h3 className="mb-2 text-base font-semibold">Simple Comment List</h3>
        <p className="mb-2 text-sm">{comments.length} comments available</p>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.commentId}
            className={`relative rounded-lg border p-4 ${
              selectedCommentIds.includes(comment.commentId)
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={comment.author.avatarUrl || "https://ui-avatars.com/api/?name=User"}
                  alt={comment.author.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="font-medium">{comment.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                  {comment.platform}
                </span>
              </div>
            </div>
            <div className="mt-3">{comment.content}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelectComment(comment.commentId)}
                  className={`rounded-full p-1.5 text-sm ${
                    selectedCommentIds.includes(comment.commentId)
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  }`}
                >
                  {selectedCommentIds.includes(comment.commentId) ? "Selected" : "Select"}
                </button>
              </div>
              <button
                onClick={() => onViewFullPost(comment.postId)}
                className="text-sm text-primary hover:underline"
              >
                View Post
              </button>
            </div>
          </div>
        ))}

        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <button
              onClick={onLoadMore}
              disabled={isFetchingNextPage}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading more..." : "Load more comments"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
