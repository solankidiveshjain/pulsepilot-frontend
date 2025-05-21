import * as React from "react";
import { useScreenReaderAnnouncement } from "./use-screen-reader-announcement";

interface InfiniteScrollOptions<T> {
  loadMore: () => Promise<T[]>;
  hasMore: boolean;
  threshold?: number;
  onLoadStart?: () => void;
  onLoadSuccess?: (items: T[]) => void;
  onLoadError?: (error: Error) => void;
  onLoadComplete?: () => void;
}

interface InfiniteScrollState<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
  observerRef: (node: HTMLElement | null) => void;
}

export function useInfiniteScroll<T>({
  loadMore,
  hasMore: initialHasMore,
  threshold = 0.5,
  onLoadStart,
  onLoadSuccess,
  onLoadError,
  onLoadComplete,
}: InfiniteScrollOptions<T>): InfiniteScrollState<T> {
  const [items, setItems] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [hasMore, setHasMore] = React.useState(initialHasMore);
  const { announceToScreenReader } = useScreenReaderAnnouncement();

  const loadMoreItems = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);
      onLoadStart?.();

      const newItems = await loadMore();
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);

      onLoadSuccess?.(newItems);
      announceToScreenReader(`Loaded ${newItems.length} more items`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load more items");
      setError(error);
      onLoadError?.(error);
      announceToScreenReader(`Error loading more items: ${error.message}`);
    } finally {
      setIsLoading(false);
      onLoadComplete?.();
    }
  }, [
    isLoading,
    hasMore,
    loadMore,
    onLoadStart,
    onLoadSuccess,
    onLoadError,
    onLoadComplete,
    announceToScreenReader,
  ]);

  const reset = React.useCallback(() => {
    setItems([]);
    setIsLoading(false);
    setError(null);
    setHasMore(initialHasMore);
  }, [initialHasMore]);

  const observerRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && hasMore && !isLoading) {
            loadMoreItems();
          }
        },
        {
          threshold,
          rootMargin: "100px",
        }
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasMore, isLoading, loadMoreItems, threshold]
  );

  return {
    items,
    isLoading,
    error,
    hasMore,
    loadMore: loadMoreItems,
    reset,
    observerRef,
  };
}
