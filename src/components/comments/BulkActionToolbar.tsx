import { useBulkActions } from "@/hooks/use-comments";
import { BulkAction } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { Archive, Check, Flag, MoreHorizontal, X } from "lucide-react";
import { memo } from "react";

export interface BulkActionToolbarProps {
  selectedCount: number;
  onUnselectAll: () => void;
  commentIds: string[];
  className?: string;
}

export const BulkActionToolbar = memo(function BulkActionToolbar({
  selectedCount,
  onUnselectAll,
  commentIds,
  className,
}: BulkActionToolbarProps) {
  const { performBulkAction, isLoading } = useBulkActions();

  const handleAction = async (action: BulkAction) => {
    if (commentIds.length === 0 || isLoading) return;

    await performBulkAction(action, commentIds);
    // After action completes, clear selection
    onUnselectAll();
  };

  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t bg-background px-4 py-2 shadow-lg md:px-6",
        className
      )}
    >
      <div className="flex items-center gap-2 px-3">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "comment" : "comments"} selected
        </span>
        <button
          onClick={onUnselectAll}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-border pl-2">
        <button
          onClick={() => handleAction("mark_read")}
          disabled={isLoading}
          className="focus:ring-offset-2 inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          aria-label="Mark as read"
        >
          <Check className="mr-2 h-4 w-4 text-green-600" />
          Mark Read
        </button>

        <button
          onClick={() => handleAction("archive")}
          disabled={isLoading}
          className="focus:ring-offset-2 inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          aria-label="Archive comments"
        >
          <Archive className="mr-2 h-4 w-4 text-blue-500" />
          Archive
        </button>

        <button
          onClick={() => handleAction("flag")}
          disabled={isLoading}
          className="focus:ring-offset-2 inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          aria-label="Flag comments"
        >
          <Flag className="mr-2 h-4 w-4 text-red-500" />
          Flag
        </button>

        <div className="relative">
          <button
            disabled={isLoading}
            className="focus:ring-offset-2 inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {/* Dropdown menu would go here */}
        </div>
      </div>
    </div>
  );
});
