import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CommentErrorProps {
  error: Error;
  onRetry?: () => void;
}

export function CommentError({ error, onRetry }: CommentErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-destructive">Error Loading Comments</h3>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
