import { getReplies } from "@/lib/api/commentsService";
import type { CommentReply } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch replies for a comment via the service layer
 */
export function useReplies(teamId: string, commentId: string) {
  return useQuery<CommentReply[], Error>({
    queryKey: ["replies", teamId, commentId],
    queryFn: () => getReplies(teamId, commentId),
  });
}
