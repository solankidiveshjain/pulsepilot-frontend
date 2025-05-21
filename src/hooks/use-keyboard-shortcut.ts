import * as React from "react";
import { useScreenReaderAnnouncement } from "./use-screen-reader-announcement";

type KeyCombo = string | string[];
type ModifierKey = "ctrl" | "alt" | "shift" | "meta";

interface KeyboardShortcutOptions {
  key: KeyCombo;
  modifiers?: ModifierKey[];
  description: string;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  onPress: (e: KeyboardEvent) => void;
}

interface KeyboardShortcutState {
  isPressed: boolean;
  activate: () => void;
  deactivate: () => void;
}

export function useKeyboardShortcut({
  key,
  modifiers = [],
  description,
  enabled = true,
  preventDefault = true,
  stopPropagation = true,
  onPress,
}: KeyboardShortcutOptions): KeyboardShortcutState {
  const [isPressed, setIsPressed] = React.useState(false);
  const { announceToScreenReader } = useScreenReaderAnnouncement();

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const pressedKey = e.key.toLowerCase();
      const targetKey = Array.isArray(key) ? key : [key];
      const isTargetKey = targetKey.some((k) => k.toLowerCase() === pressedKey);

      const modifierStates = {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey,
      };

      const isModifierMatch = modifiers.every((mod) => modifierStates[mod]);

      if (isTargetKey && isModifierMatch) {
        if (preventDefault) {
          e.preventDefault();
        }
        if (stopPropagation) {
          e.stopPropagation();
        }

        setIsPressed(true);
        onPress(e);
        announceToScreenReader(`Shortcut activated: ${description}`);
      }
    },
    [
      enabled,
      key,
      modifiers,
      preventDefault,
      stopPropagation,
      onPress,
      description,
      announceToScreenReader,
    ]
  );

  const handleKeyUp = React.useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const pressedKey = e.key.toLowerCase();
      const targetKey = Array.isArray(key) ? key : [key];
      const isTargetKey = targetKey.some((k) => k.toLowerCase() === pressedKey);

      if (isTargetKey) {
        setIsPressed(false);
      }
    },
    [enabled, key]
  );

  const activate = React.useCallback(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    announceToScreenReader(`Keyboard shortcut enabled: ${description}`);
  }, [enabled, handleKeyDown, handleKeyUp, description, announceToScreenReader]);

  const deactivate = React.useCallback(() => {
    if (!enabled) return;

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    setIsPressed(false);
    announceToScreenReader(`Keyboard shortcut disabled: ${description}`);
  }, [enabled, handleKeyDown, handleKeyUp, description, announceToScreenReader]);

  // Auto-activate on mount if enabled
  React.useEffect(() => {
    if (enabled) {
      activate();
    }
    return () => {
      if (enabled) {
        deactivate();
      }
    };
  }, [enabled, activate, deactivate]);

  return {
    isPressed,
    activate,
    deactivate,
  };
}
