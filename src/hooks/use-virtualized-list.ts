import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import * as React from "react";
import { useScreenReaderAnnouncement } from "./use-screen-reader-announcement";

interface VirtualizedListOptions<T> {
  items: T[];
  itemHeight: number | ((index: number) => number);
  overscan?: number;
  onItemClick?: (item: T, index: number) => void;
  onItemKeyDown?: (item: T, index: number, event: React.KeyboardEvent) => void;
  getItemAriaLabel?: (item: T, index: number) => string;
  getItemAriaDescription?: (item: T, index: number) => string;
  getItemAriaRole?: (item: T, index: number) => string;
}

interface VirtualizedListState<T> {
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualItems: ReturnType<Virtualizer<HTMLDivElement, Element>["getVirtualItems"]>;
  totalSize: number;
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
  measure: () => void;
  getItemProps: (index: number) => {
    ref: (element: HTMLElement | null) => void;
    style: React.CSSProperties;
    role: string;
    "aria-label": string;
    "aria-description"?: string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  items: T[];
}

export function useVirtualizedList<T>({
  items,
  itemHeight,
  overscan = 5,
  onItemClick,
  onItemKeyDown,
  getItemAriaLabel = (item, index) => `Item ${index + 1}`,
  getItemAriaDescription,
  getItemAriaRole = () => "listitem",
}: VirtualizedListOptions<T>): VirtualizedListState<T> {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { announceToScreenReader } = useScreenReaderAnnouncement();

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: React.useCallback(
      (index) => (typeof itemHeight === "function" ? itemHeight(index) : itemHeight),
      [itemHeight]
    ),
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const scrollToIndex = React.useCallback(
    (index: number) => {
      virtualizer.scrollToIndex(index, { align: "center" });
      const item = items[index];
      if (item) {
        announceToScreenReader(`Scrolled to ${getItemAriaLabel(item, index)}`);
      }
    },
    [virtualizer, items, getItemAriaLabel, announceToScreenReader]
  );

  const scrollToOffset = React.useCallback(
    (offset: number) => {
      virtualizer.scrollToOffset(offset);
    },
    [virtualizer]
  );

  const measure = React.useCallback(() => {
    virtualizer.measure();
  }, [virtualizer]);

  const getItemProps = React.useCallback(
    (index: number) => {
      const item = items[index];
      const virtualItem = virtualItems.find((item) => item.index === index);

      if (!item || !virtualItem) {
        return {
          ref: () => {},
          style: {} as React.CSSProperties,
          role: "listitem",
          "aria-label": `Item ${index + 1}`,
          tabIndex: 0,
          onClick: () => {},
          onKeyDown: () => {},
        };
      }

      return {
        ref: (element: HTMLElement | null) => {
          if (element) {
            virtualizer.measureElement(element);
          }
        },
        style: {
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: "100%",
          height: virtualItem.size,
          transform: `translateY(${virtualItem.start}px)`,
        },
        role: getItemAriaRole(item, index),
        "aria-label": getItemAriaLabel(item, index),
        "aria-description": getItemAriaDescription?.(item, index),
        tabIndex: 0,
        onClick: () => {
          onItemClick?.(item, index);
          announceToScreenReader(`Selected ${getItemAriaLabel(item, index)}`);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          onItemKeyDown?.(item, index, e);
        },
      };
    },
    [
      items,
      virtualItems,
      virtualizer,
      getItemAriaRole,
      getItemAriaLabel,
      getItemAriaDescription,
      onItemClick,
      onItemKeyDown,
      announceToScreenReader,
    ]
  );

  return {
    virtualizer,
    virtualItems,
    totalSize: virtualizer.getTotalSize(),
    scrollToIndex,
    scrollToOffset,
    measure,
    getItemProps,
    items,
  };
}
