import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  className?: string;
}

export function InfiniteScrollLoader({ isLoading, className }: InfiniteScrollLoaderProps) {
  if (!isLoading) return null;
  
  return (
    <div className={cn('flex justify-center items-center py-6', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading more comments...</p>
      </div>
    </div>
  );
} 