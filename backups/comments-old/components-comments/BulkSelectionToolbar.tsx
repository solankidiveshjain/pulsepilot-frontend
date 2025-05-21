import { cn } from '@/lib/utils';
import { Archive, Check, MessageSquare, X } from 'lucide-react';

interface BulkSelectionToolbarProps {
  selectedCount: number;
  onReply: () => void;
  onMarkAsRead: () => void;
  onArchive: () => void;
  onCancel: () => void;
  className?: string;
}

export function BulkSelectionToolbar({
  selectedCount,
  onReply,
  onMarkAsRead,
  onArchive,
  onCancel,
  className,
}: BulkSelectionToolbarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <div className={cn(
      'fixed bottom-0 left-0 z-50 w-full bg-background border-t shadow-lg py-2 px-4 md:px-6',
      className
    )}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{selectedCount} selected</span>
          <button 
            className="rounded-full p-1 hover:bg-muted transition-colors"
            onClick={onCancel}
            aria-label="Cancel selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={onReply}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Bulk Reply
          </button>
          
          <button 
            className="inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={onMarkAsRead}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark as Read
          </button>
          
          <button 
            className="inline-flex items-center rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={onArchive}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </button>
        </div>
      </div>
    </div>
  );
} 