import * as React from "react";

interface UseLoadingStateOptions {
  timeout?: number;
  onTimeout?: () => void;
  onError?: (error: Error) => void;
}

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error) => void;
  reset: () => void;
}

const defaultOptions: UseLoadingStateOptions = {};

export function useLoadingState(options: UseLoadingStateOptions = defaultOptions): LoadingState {
  const { timeout, onTimeout, onError } = options;
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (timeout) {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        onTimeout?.();
      }, timeout);
    }
  }, [timeout, onTimeout]);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleError = React.useCallback(
    (error: Error) => {
      setError(error);
      setIsLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      onError?.(error);
    },
    [onError]
  );

  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: handleError,
    reset,
  };
}
