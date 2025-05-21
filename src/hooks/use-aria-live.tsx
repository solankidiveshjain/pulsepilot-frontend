import * as React from "react";

type AriaLivePoliteness = "off" | "polite" | "assertive";

interface UseAriaLiveOptions {
  politeness?: AriaLivePoliteness;
  timeout?: number;
}

export function useAriaLive(options: UseAriaLiveOptions = {}) {
  const { politeness = "polite", timeout = 5000 } = options;
  const [message, setMessage] = React.useState<string>("");
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const announce = React.useCallback(
    (newMessage: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(newMessage);

      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          setMessage("");
        }, timeout);
      }
    },
    [timeout]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const LiveRegion = React.useCallback(
    () => (
      <div role="status" aria-live={politeness} className="sr-only" aria-atomic="true">
        {message}
      </div>
    ),
    [message, politeness]
  );

  return {
    announce,
    LiveRegion,
  };
}
