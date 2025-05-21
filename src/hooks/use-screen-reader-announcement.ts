import * as React from "react";

type AnnouncementPriority = "polite" | "assertive";

interface Announcement {
  id: string;
  message: string;
  priority: AnnouncementPriority;
  timestamp: number;
}

interface ScreenReaderAnnouncementState {
  announceToScreenReader: (message: string, priority?: AnnouncementPriority) => void;
  clearAnnouncements: () => void;
  currentAnnouncement: Announcement | null;
}

export function useScreenReaderAnnouncement(): ScreenReaderAnnouncementState {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = React.useState<Announcement | null>(null);
  const liveRegionRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Create live region on mount
  React.useEffect(() => {
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.style.position = "absolute";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.padding = "0";
    liveRegion.style.overflow = "hidden";
    liveRegion.style.clip = "rect(0, 0, 0, 0)";
    liveRegion.style.whiteSpace = "nowrap";
    liveRegion.style.border = "0";
    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      document.body.removeChild(liveRegion);
    };
  }, []);

  // Process announcements queue
  React.useEffect(() => {
    if (!liveRegionRef.current || announcements.length === 0) return;

    const nextAnnouncement = announcements[0];
    if (!nextAnnouncement) return;

    // Update live region
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute("aria-live", nextAnnouncement.priority);
      liveRegionRef.current.textContent = nextAnnouncement.message;
    }

    // Set current announcement
    setCurrentAnnouncement(nextAnnouncement);

    // Remove from queue after a delay
    timeoutRef.current = setTimeout(() => {
      setAnnouncements((prev) => prev.slice(1));
      setCurrentAnnouncement(null);
    }, 1000); // Wait for screen reader to process

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [announcements]);

  const announceToScreenReader = React.useCallback(
    (message: string, priority: AnnouncementPriority = "polite") => {
      const announcement: Announcement = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        priority,
        timestamp: Date.now(),
      };

      setAnnouncements((prev) => {
        // If the new announcement is assertive, clear the queue
        if (priority === "assertive") {
          return [announcement];
        }

        // Otherwise, add to the queue
        return [...prev, announcement];
      });
    },
    []
  );

  const clearAnnouncements = React.useCallback(() => {
    setAnnouncements([]);
    setCurrentAnnouncement(null);
  }, []);

  return {
    announceToScreenReader,
    clearAnnouncements,
    currentAnnouncement,
  };
}
