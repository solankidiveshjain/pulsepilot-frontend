"use client";

import { CommentsContainer } from "@/components/comments/containers/CommentsContainer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Suspense } from "react";

/**
 * Simplified Comments page that uses the CommentsContainer component
 */
export default function CommentsSidebarPage() {
  return (
    <div className="h-full w-full">
      <ErrorBoundary
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
              <h2 className="mb-2 text-lg font-medium text-red-800 dark:text-red-400">
                Error Loading Comments
              </h2>
              <p className="text-sm text-red-600 dark:text-red-300">
                There was a problem loading the comments interface. Please refresh the page.
              </p>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          }
        >
          <CommentsContainer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
