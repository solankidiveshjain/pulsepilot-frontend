import * as React from "react";
import { useScreenReaderAnnouncement } from "./use-screen-reader-announcement";

type Direction = "horizontal" | "vertical" | "grid";
type FocusStrategy = "first" | "last" | "closest";

interface KeyboardNavigationOptions {
  direction?: Direction;
  focusStrategy?: FocusStrategy;
  loop?: boolean;
  onFocusChange?: (index: number) => void;
  onEnter?: (index: number) => void;
  onEscape?: () => void;
}

interface KeyboardNavigationState {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  registerItem: (index: number) => (ref: HTMLElement | null) => void;
}

export function useKeyboardNavigation(
  itemCount: number,
  options: KeyboardNavigationOptions = {}
): KeyboardNavigationState {
  const {
    direction = "horizontal",
    focusStrategy = "closest",
    loop = true,
    onFocusChange,
    onEnter,
    onEscape,
  } = options;

  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
  const { announceToScreenReader } = useScreenReaderAnnouncement();

  const getNextIndex = React.useCallback(
    (currentIndex: number, key: string): number => {
      if (itemCount === 0) return -1;

      let nextIndex = currentIndex;

      switch (key) {
        case "ArrowRight":
          if (direction === "horizontal" || direction === "grid") {
            nextIndex = currentIndex + 1;
          }
          break;
        case "ArrowLeft":
          if (direction === "horizontal" || direction === "grid") {
            nextIndex = currentIndex - 1;
          }
          break;
        case "ArrowDown":
          if (direction === "vertical" || direction === "grid") {
            nextIndex = currentIndex + (direction === "grid" ? 3 : 1);
          }
          break;
        case "ArrowUp":
          if (direction === "vertical" || direction === "grid") {
            nextIndex = currentIndex - (direction === "grid" ? 3 : 1);
          }
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = itemCount - 1;
          break;
      }

      if (loop) {
        if (nextIndex >= itemCount) nextIndex = 0;
        if (nextIndex < 0) nextIndex = itemCount - 1;
      } else {
        if (nextIndex >= itemCount) nextIndex = itemCount - 1;
        if (nextIndex < 0) nextIndex = 0;
      }

      return nextIndex;
    },
    [direction, itemCount, loop]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key;

      if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
        e.preventDefault();
        const nextIndex = getNextIndex(focusedIndex, key);
        setFocusedIndex(nextIndex);
        onFocusChange?.(nextIndex);

        // Announce focus change to screen reader
        const item = itemRefs.current[nextIndex];
        if (item) {
          const label = item.getAttribute("aria-label") || item.textContent;
          if (label) {
            announceToScreenReader(`Focused: ${label}`);
          }
        }
      } else if (key === "Enter" && focusedIndex !== -1) {
        e.preventDefault();
        onEnter?.(focusedIndex);
      } else if (key === "Escape") {
        e.preventDefault();
        onEscape?.();
      }
    },
    [focusedIndex, getNextIndex, onFocusChange, onEnter, onEscape, announceToScreenReader]
  );

  const registerItem = React.useCallback(
    (index: number) => (ref: HTMLElement | null) => {
      itemRefs.current[index] = ref;
    },
    []
  );

  // Focus management
  React.useEffect(() => {
    if (focusedIndex === -1) {
      // Initial focus
      if (focusStrategy === "first") {
        setFocusedIndex(0);
      } else if (focusStrategy === "last") {
        setFocusedIndex(itemCount - 1);
      }
    } else {
      // Focus the element
      const item = itemRefs.current[focusedIndex];
      if (item) {
        item.focus();
      }
    }
  }, [focusedIndex, focusStrategy, itemCount]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    registerItem,
  };
}
