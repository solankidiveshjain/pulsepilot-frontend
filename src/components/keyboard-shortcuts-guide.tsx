"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

interface ShortcutItem {
  keys: string[]
  description: string
  category: string
}

const shortcuts: ShortcutItem[] = [
  { keys: ["↑"], description: "Navigate to previous comment", category: "Navigation" },
  { keys: ["↓"], description: "Navigate to next comment", category: "Navigation" },
  { keys: ["Enter"], description: "Reply to selected comment", category: "Actions" },
  { keys: ["Space"], description: "Toggle comment selection", category: "Selection" },
  { keys: ["Ctrl", "A"], description: "Select all comments", category: "Selection" },
  { keys: ["Ctrl", "D"], description: "Deselect all comments", category: "Selection" },
  { keys: ["Ctrl", "F"], description: "Focus search box", category: "Navigation" },
  { keys: ["Esc"], description: "Close dialogs or cancel selection", category: "General" },
  { keys: ["Ctrl", "S"], description: "Save changes", category: "General" },
  { keys: ["Ctrl", "Z"], description: "Undo last action", category: "General" },
  { keys: ["Ctrl", "Shift", "Z"], description: "Redo last action", category: "General" },
  { keys: ["Alt", "1"], description: "Go to Comments tab", category: "Navigation" },
  { keys: ["Alt", "2"], description: "Go to Insights tab", category: "Navigation" },
  { keys: ["Alt", "3"], description: "Go to AI Suggestions tab", category: "Navigation" },
  { keys: ["Alt", "4"], description: "Go to Settings tab", category: "Navigation" },
]

export function KeyboardShortcutsGuide() {
  const [open, setOpen] = useState(false)

  // Group shortcuts by category
  const categories = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = []
      }
      acc[shortcut.category].push(shortcut)
      return acc
    },
    {} as Record<string, ShortcutItem[]>,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(categories).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-primary">{category}</h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-2 py-1 text-xs font-semibold bg-muted rounded border border-border/40 min-w-[28px] text-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded border border-border/40">?</kbd> anywhere to open
          this dialog
        </div>
      </DialogContent>
    </Dialog>
  )
}
