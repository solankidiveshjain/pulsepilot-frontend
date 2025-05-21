import { MessageSquare } from "lucide-react";

interface CommentEmptyProps {
  message?: string;
}

export function CommentEmpty({ message = "No comments yet" }: CommentEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
      <MessageSquare className="h-8 w-8 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No Comments</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
