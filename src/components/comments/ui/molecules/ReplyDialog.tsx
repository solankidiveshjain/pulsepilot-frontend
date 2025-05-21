import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comments";
import { Send, Sparkles } from "lucide-react";
import React from "react";

interface ReplyDialogProps {
  comment: Comment;
  isOpen: boolean;
  onClose: () => void;
  onReply: (text: string) => void;
  isGenerating?: boolean;
  onGenerate?: () => void;
  className?: string;
}

export const ReplyDialog = React.memo(function ReplyDialog({
  comment,
  isOpen,
  onClose,
  onReply,
  isGenerating = false,
  onGenerate,
  className,
}: ReplyDialogProps) {
  const [replyText, setReplyText] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (replyText.trim()) {
        onReply(replyText.trim());
        setReplyText("");
        onClose();
      }
    },
    [replyText, onReply, onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[600px]", className)}>
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
          <DialogDescription>Craft a personalized response to this comment</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 rounded-lg border bg-muted/30 p-4">
            <p className="mb-2 text-sm text-muted-foreground">Original Comment:</p>
            <p className="text-sm">{comment.text}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {comment.platform}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs", {
                  "bg-green-100 text-green-800": comment.sentiment === "positive",
                  "bg-red-100 text-red-800": comment.sentiment === "negative",
                  "bg-gray-100 text-gray-800": comment.sentiment === "neutral",
                })}
              >
                {comment.sentiment}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Textarea
              ref={textareaRef}
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </form>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!replyText.trim()}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
