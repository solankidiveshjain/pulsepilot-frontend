"use client";

import { CommentsContainer } from "@/components/comments/containers/CommentsContainer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Suspense } from "react";

/**
 * Comments page with improved architecture using domain models,
 * fine-grained store subscriptions, and virtualized lists.
 */
export default function CommentsPage() {
  return (
    <div className="h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      <ErrorBoundary
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
              <h2 className="mb-2 text-lg font-medium text-red-800 dark:text-red-400">
                Error Loading Comments
              </h2>
              <p className="text-sm text-red-600 dark:text-red-300">
                There was a problem loading the comments interface. Please refresh the page or try
                again later.
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
