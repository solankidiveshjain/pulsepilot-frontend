import * as React from "react";

export function useFocusTrap(active = true) {
  const ref = React.useRef<HTMLDivElement>(null);
  const previousFocus = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!active) return;

    const element = ref.current;
    if (!element) return;

    // Store the previously focused element
    previousFocus.current = document.activeElement as HTMLElement;

    // Find all focusable elements
    const focusableElements = Array.from(
      element.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled") && !el.hasAttribute("aria-hidden"));

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstFocusable.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // If shift + tab and on first element, focus last element
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // If tab and on last element, focus first element
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
      // Restore focus when unmounting
      previousFocus.current?.focus();
    };
  }, [active]);

  return ref;
}
