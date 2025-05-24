"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Reply,
  Archive,
  BookmarkIcon,
  CheckSquare,
  Square,
  X,
} from "lucide-react"

interface BulkActionsToolbarProps {
  selectedCommentsCount: number
  totalCommentsInFeed: number
  onToggleSelectAll: () => void
  onBulkReply: () => void
  onBulkArchive: () => void
  onBulkSaveForLater?: () => void
  onClearSelection: () => void
  isMobile?: boolean
}

export function BulkActionsToolbar({
  selectedCommentsCount,
  totalCommentsInFeed,
  onToggleSelectAll,
  onBulkReply,
  onBulkArchive,
  onBulkSaveForLater,
  onClearSelection,
  isMobile = false,
}: BulkActionsToolbarProps) {
  if (selectedCommentsCount === 0) {
    return null
  }

  return (
    <div className="bulk-action-bar">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onToggleSelectAll}>
          {selectedCommentsCount === totalCommentsInFeed && totalCommentsInFeed > 0 ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        <span className="text-xs font-medium">{selectedCommentsCount} selected</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap" onClick={onBulkReply}>
          <Reply className="mr-1 h-3.5 w-3.5" />
          Bulk Reply
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap" onClick={onBulkArchive}>
          <Archive className="mr-1 h-3.5 w-3.5" />
          Archive
        </Button>
        {!isMobile && onBulkSaveForLater && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs whitespace-nowrap"
            onClick={onBulkSaveForLater}
          >
            <BookmarkIcon className="mr-1 h-3.5 w-3.5" />
            Save for Later
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClearSelection}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
