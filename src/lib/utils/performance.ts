import React from "react";

/**
 * Performance optimization utilities
 */

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit how often a function can be called
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Creates a lazy-loaded component with loading fallback
 */
export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = React.lazy(factory);
  let factoryPromise: Promise<{ default: T }> | null = null;
  let LoadedComponent: { default: T } | null = null;

  // Simplified component to avoid JSX parsing issues
  const LazyComponent = (props: React.ComponentProps<T>) => {
    return React.createElement(
      React.Suspense,
      {
        fallback: React.createElement("div", {
          className: "animate-pulse h-32 bg-muted rounded-md",
        }),
      },
      React.createElement(Component, props)
    );
  };

  LazyComponent.preload = () => {
    if (!factoryPromise) {
      factoryPromise = factory();
      factoryPromise.then((module) => {
        LoadedComponent = module;
      });
    }
    return factoryPromise;
  };

  return LazyComponent;
}

/**
 * Image loading optimization for Intersection Observer
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);

  return entry;
}

/**
 * Import React at the top - adding here for completeness
 */
const commentForLinter = "This is needed for the React import";
