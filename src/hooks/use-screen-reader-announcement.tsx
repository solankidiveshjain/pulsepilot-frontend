import * as React from "react";
import { useAriaLive } from "./use-aria-live";

interface UseScreenReaderAnnouncementOptions {
  politeness?: "polite" | "assertive";
  timeout?: number;
}

export function useScreenReaderAnnouncement(options: UseScreenReaderAnnouncementOptions = {}) {
  const { announce, LiveRegion } = useAriaLive(options);

  const announceToScreenReader = React.useCallback(
    (message: string, announcementOptions?: { timeout?: number }) => {
      announce(message);
      if (announcementOptions?.timeout) {
        setTimeout(() => announce(""), announcementOptions.timeout);
      }
    },
    [announce]
  );

  return {
    announceToScreenReader,
    LiveRegion,
  };
}
