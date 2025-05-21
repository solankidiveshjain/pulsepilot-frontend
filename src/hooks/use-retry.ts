import * as React from "react";

interface UseRetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number) => void;
  onMaxAttemptsReached?: () => void;
}

interface RetryState {
  attempt: number;
  isRetrying: boolean;
  retry: () => Promise<void>;
  reset: () => void;
}

const defaultOptions: UseRetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
};

export function useRetry(
  operation: () => Promise<void>,
  options: UseRetryOptions = defaultOptions
): RetryState {
  const {
    maxAttempts = defaultOptions.maxAttempts!,
    initialDelay = defaultOptions.initialDelay!,
    maxDelay = defaultOptions.maxDelay!,
    onRetry,
    onMaxAttemptsReached,
  } = options;

  const [attempt, setAttempt] = React.useState(0);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const calculateDelay = React.useCallback(
    (currentAttempt: number) => {
      const delay = Math.min(initialDelay * Math.pow(2, currentAttempt), maxDelay);
      return delay + Math.random() * 1000; // Add jitter
    },
    [initialDelay, maxDelay]
  );

  const retry = React.useCallback(async () => {
    if (attempt >= maxAttempts) {
      onMaxAttemptsReached?.();
      return;
    }

    setIsRetrying(true);
    setAttempt((prev) => prev + 1);

    try {
      await operation();
      setIsRetrying(false);
    } catch {
      const nextAttempt = attempt + 1;
      if (nextAttempt < maxAttempts) {
        const delay = calculateDelay(nextAttempt);
        timeoutRef.current = setTimeout(() => {
          onRetry?.(nextAttempt);
          retry();
        }, delay);
      } else {
        setIsRetrying(false);
        onMaxAttemptsReached?.();
      }
    }
  }, [attempt, maxAttempts, operation, calculateDelay, onRetry, onMaxAttemptsReached]);

  const reset = React.useCallback(() => {
    setAttempt(0);
    setIsRetrying(false);
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
    attempt,
    isRetrying,
    retry,
    reset,
  };
}
