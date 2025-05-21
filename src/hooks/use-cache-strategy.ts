import * as React from "react";

interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  onRevalidate?: () => Promise<void>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isStale: boolean;
}

interface CacheStrategy<T> {
  get: () => CacheEntry<T> | null;
  set: (data: T) => void;
  invalidate: () => void;
  revalidate: () => Promise<void>;
}

export function useCacheStrategy<T>(key: string, options: CacheOptions = {}): CacheStrategy<T> {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate = true,
    onRevalidate,
  } = options;

  const [cache, setCache] = React.useState<Record<string, CacheEntry<T>>>({});

  const get = React.useCallback((): CacheEntry<T> | null => {
    const entry = cache[key];
    if (!entry) return null;

    const now = Date.now();
    const isStale = now - entry.timestamp > ttl;

    if (isStale && staleWhileRevalidate) {
      // Trigger revalidation in the background
      onRevalidate?.();
    }

    return {
      ...entry,
      isStale,
    };
  }, [cache, key, ttl, staleWhileRevalidate, onRevalidate]);

  const set = React.useCallback(
    (data: T) => {
      setCache((prev) => ({
        ...prev,
        [key]: {
          data,
          timestamp: Date.now(),
          isStale: false,
        },
      }));
    },
    [key]
  );

  const invalidate = React.useCallback(() => {
    setCache((prev) => {
      const newCache = { ...prev };
      delete newCache[key];
      return newCache;
    });
  }, [key]);

  const revalidate = React.useCallback(async () => {
    if (onRevalidate) {
      try {
        await onRevalidate();
      } catch (error) {
        console.error("Cache revalidation failed:", error);
      }
    }
  }, [onRevalidate]);

  // Clean up stale entries periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCache((prev) => {
        const newCache = { ...prev };
        let hasChanges = false;

        Object.entries(newCache).forEach(([k, entry]) => {
          if (now - entry.timestamp > ttl * 2) {
            delete newCache[k];
            hasChanges = true;
          }
        });

        return hasChanges ? newCache : prev;
      });
    }, ttl);

    return () => clearInterval(interval);
  }, [ttl]);

  return {
    get,
    set,
    invalidate,
    revalidate,
  };
}
