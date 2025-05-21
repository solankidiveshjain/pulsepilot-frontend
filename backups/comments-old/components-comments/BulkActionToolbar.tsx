import { useBulkActions } from "@/hooks/use-comments";
import { BulkAction } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Check, Flag, MoreHorizontal, X } from "lucide-react";
import { memo, useEffect, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);

  // Animate in the toolbar when comments are selected
  useEffect(() => {
    if (selectedCount > 0) {
      setIsVisible(true);
    } else {
      // Slight delay to allow for animation out
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCount]);

  const handleAction = async (action: BulkAction) => {
    if (commentIds.length === 0 || isLoading) return;

    await performBulkAction(action, commentIds);
    // After action completes, clear selection
    onUnselectAll();
  };

  if (selectedCount === 0) return null;

  // Only show up to 3 comment IDs in the preview
  const displayedCommentIds = commentIds.slice(0, 3);
  const additionalCount = commentIds.length - displayedCommentIds.length;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "absolute bottom-0 left-0 z-50 h-[56px] w-full border-t border-gray-200 bg-white shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-gray-900",
            className
          )}
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-8 lg:px-[80px]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <span className="text-sm font-semibold">{selectedCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {selectedCount} {selectedCount === 1 ? "comment" : "comments"} selected
                </span>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {displayedCommentIds.map((id) => (
                    <span
                      key={id}
                      className="max-w-[120px] truncate rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800"
                    >
                      {`ID-${id.substring(0, 6)}`}
                    </span>
                  ))}
                  {additionalCount > 0 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                      +{additionalCount} more
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onUnselectAll}
                className="ml-2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:hover:bg-gray-800"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-4 dark:border-gray-700">
              <button
                onClick={() => handleAction("mark_read")}
                disabled={isLoading}
                className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Mark as read"
              >
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Mark Read
              </button>

              <button
                onClick={() => handleAction("archive")}
                disabled={isLoading}
                className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Archive comments"
              >
                <Archive className="mr-2 h-4 w-4 text-blue-500" />
                Archive
              </button>

              <button
                onClick={() => handleAction("flag")}
                disabled={isLoading}
                className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Flag comments"
              >
                <Flag className="mr-2 h-4 w-4 text-red-500" />
                Flag
              </button>

              <div className="relative">
                <button
                  disabled={isLoading}
                  className="focus:ring-offset-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
