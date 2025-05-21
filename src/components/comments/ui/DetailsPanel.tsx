"use client";

import { selectSelectedComments, useCommentsStore } from "../state/CommentsStore";

interface DetailsPanelProps {
  onAction?: (action: string) => void;
}

/**
 * Details panel component for displaying and taking actions on selected comments.
 */
export function DetailsPanel({ onAction }: DetailsPanelProps) {
  const { clearSelection } = useCommentsStore();
  const selectedComments = useCommentsStore(selectSelectedComments);

  const handleAction = (action: string) => {
    onAction?.(action);
  };

  return (
    <div className="space-y-6 rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Selected ({selectedComments.length})</h3>
        <button
          onClick={clearSelection}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAction("mark_read")}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Mark as Read
          </button>
          <button
            onClick={() => handleAction("flag")}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Flag
          </button>
          <button
            onClick={() => handleAction("archive")}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Archive
          </button>
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
            Reply
          </button>
        </div>
      </div>

      {/* Selected Comments Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Selected Comments</h4>
        <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
          {selectedComments.map((comment) => (
            <div key={comment.id} className="rounded-md border p-3 shadow-sm">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-medium">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.formatRelativeTime()}</span>
              </div>
              <p className="line-clamp-2 text-xs text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
