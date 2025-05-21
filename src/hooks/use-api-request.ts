import * as React from "react";
import { useCacheStrategy } from "./use-cache-strategy";
import { useLoadingState } from "./use-loading-state";
import { useScreenReaderAnnouncement } from "./use-screen-reader-announcement";

interface ApiRequestOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  cacheKey?: string;
  cacheOptions?: {
    ttl?: number;
    staleWhileRevalidate?: boolean;
  };
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiRequestState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (options?: { body?: unknown }) => Promise<void>;
  reset: () => void;
}

export function useApiRequest<T>({
  url,
  method = "GET",
  body,
  headers = {},
  cacheKey,
  cacheOptions,
  onSuccess,
  onError,
}: ApiRequestOptions<T>): ApiRequestState<T> {
  const [data, setData] = React.useState<T | null>(null);
  const { announceToScreenReader } = useScreenReaderAnnouncement();

  const {
    isLoading,
    error: loadingError,
    startLoading,
    stopLoading,
    setError: setLoadingError,
  } = useLoadingState({
    onError: (error) => {
      announceToScreenReader(`Request failed: ${error.message}`);
      onError?.(error);
    },
  });

  const cache = useCacheStrategy<T>(cacheKey || url, {
    ...cacheOptions,
    onRevalidate: async () => {
      await execute();
    },
  });

  const execute = React.useCallback(
    async (options?: { body?: unknown }) => {
      if (cacheKey) {
        const cachedData = cache.get();
        if (cachedData && !cachedData.isStale) {
          setData(cachedData.data);
          return;
        }
      }

      startLoading();
      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: options?.body
            ? JSON.stringify(options.body)
            : body
              ? JSON.stringify(body)
              : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);
        if (cacheKey) {
          cache.set(responseData);
        }
        onSuccess?.(responseData);
        announceToScreenReader("Request completed successfully");
      } catch (error) {
        const apiError = error instanceof Error ? error : new Error("Unknown error occurred");
        setLoadingError(apiError);
        throw apiError;
      } finally {
        stopLoading();
      }
    },
    [
      cacheKey,
      cache,
      startLoading,
      stopLoading,
      url,
      method,
      headers,
      body,
      onSuccess,
      setLoadingError,
      announceToScreenReader,
    ]
  );

  const reset = React.useCallback(() => {
    setData(null);
    setLoadingError(new Error("Request reset"));
    if (cacheKey) {
      cache.invalidate();
    }
  }, [cacheKey, cache, setLoadingError]);

  return {
    data,
    error: loadingError,
    isLoading,
    execute,
    reset,
  };
}
