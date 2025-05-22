"use client"

import { useEffect, useCallback } from "react"

type KeyCombination = {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
}

type ShortcutHandler = (event: KeyboardEvent) => void

type ShortcutDefinition = {
  keys: KeyCombination
  handler: ShortcutHandler
  preventDefault?: boolean
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param shortcuts - Array of shortcut definitions
 */
export function useKeyboardShortcuts(shortcuts: ShortcutDefinition[]): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const { keys, handler, preventDefault = true } = shortcut

        const keyMatches = event.key.toLowerCase() === keys.key.toLowerCase()
        const ctrlMatches = keys.ctrl === undefined || event.ctrlKey === keys.ctrl
        const altMatches = keys.alt === undefined || event.altKey === keys.alt
        const shiftMatches = keys.shift === undefined || event.shiftKey === keys.shift
        const metaMatches = keys.meta === undefined || event.metaKey === keys.meta

        if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
          if (preventDefault) {
            event.preventDefault()
          }
          handler(event)
          break
        }
      }
    },
    [shortcuts],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
