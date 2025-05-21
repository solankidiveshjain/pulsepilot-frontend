"use client";

import { useCommentsFeed } from "@/components/comments/state/useCommentsFeed";
import { getQueryClient } from "@/components/providers/app-provider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useEffect, useState } from "react";

// Direct import of the commentsApi for testing
import { Comment } from "@/components/comments/models";
import { testDirectApi } from "@/components/comments/state/useCommentsFeed";

/**
 * Test page to show comments without virtualization
 */
export default function CommentsTestPage() {
  const { comments, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCommentsFeed();

  const [directApiResults, setDirectApiResults] = useState<{
    comments: Comment[];
    loading: boolean;
  }>({
    comments: [],
    loading: true,
  });

  const [queryCache, setQueryCache] = useState<string>("Loading cache info...");

  // Test React Query hook data
  useEffect(() => {
    console.log("Test page comments:", comments.length);
  }, [comments]);

  // Test direct API call
  useEffect(() => {
    const testApi = async () => {
      try {
        console.log("Testing direct API call...");
        const result = await testDirectApi();
        console.log("Direct API result:", result);
        setDirectApiResults({ comments: result.data, loading: false });
      } catch (error) {
        console.error("Direct API error:", error);
        setDirectApiResults({ comments: [], loading: false });
      }
    };

    testApi();
  }, []);

  // Check React Query cache
  useEffect(() => {
    const checkCache = () => {
      try {
        const queryClient = getQueryClient();
        if (!queryClient) {
          setQueryCache("Query client not available");
          return;
        }

        const queries = queryClient.getQueryCache().getAll();
        console.log("All queries:", queries);

        const cacheInfo = queries.map((query) => ({
          queryKey: JSON.stringify(query.queryKey),
          state: query.state,
        }));

        setQueryCache(JSON.stringify(cacheInfo, null, 2));
      } catch (error) {
        console.error("Error checking cache:", error);
        setQueryCache(`Error: ${error}`);
      }
    };

    // Check cache immediately and every 2 seconds
    checkCache();
    const interval = setInterval(checkCache, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-background p-8">
      <ErrorBoundary>
        <h1 className="mb-4 text-2xl font-bold">Test Comments Page (No Virtualization)</h1>

        <div className="mb-4 rounded bg-yellow-100 p-3 text-yellow-800">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <pre className="text-xs">
            Comments from React Query: {comments.length}
            <br />
            Loading: {String(isLoading)}
            <br />
            Error: {String(isError)}
            <br />
            HasNextPage: {String(hasNextPage)}
            <br />
            <br />
            <strong>Direct API Test:</strong>
            <br />
            Comments: {directApiResults.comments.length}
            <br />
            Loading: {String(directApiResults.loading)}
          </pre>
        </div>

        <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
          <h3 className="mb-2 text-lg font-semibold">React Query Cache</h3>
          <pre className="max-h-60 overflow-auto text-xs">{queryCache}</pre>
        </div>

        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
          <h3 className="mb-2 text-lg font-semibold">Direct API Results</h3>
          {directApiResults.loading ? (
            <p>Loading direct API results...</p>
          ) : directApiResults.comments.length === 0 ? (
            <p>No comments from direct API call</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {directApiResults.comments.map((comment) => (
                <div key={comment.commentId} className="mb-2 rounded border border-blue-100 p-2">
                  <p className="font-medium">{comment.author.name}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className="mb-4 text-xl font-semibold">React Query Results</h2>
        {isLoading && comments.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-3">Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">No comments found</h3>
            <p className="text-sm text-muted-foreground">No comments are available to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.commentId} className="rounded-lg border p-4">
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
              </div>
            ))}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mx-auto mt-4 block rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more..." : "Load more"}
              </button>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>
      </ErrorBoundary>
    </div>
  );
}
