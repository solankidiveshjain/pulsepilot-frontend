import type {
    BulkReplyRequest,
    BulkReplyResponse,
    ListCommentsParams,
    ReplyRequest,
} from '@/components/comments/models/api'
import {
    bulkReplyComments,
    getReplySuggestions,
    listComments,
    replyToComment,
} from '@/lib/api/commentsService'
import type { Comment, CommentReply, Pagination } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Hook to fetch comments for a team
 */
export function useComments(
  teamId: string,
  params?: ListCommentsParams
) {
  return useQuery<{ items: Comment[]; pagination: Pagination }, Error>({
    queryKey: ['comments', teamId, params],
    queryFn: () => listComments(teamId, params || {} as ListCommentsParams),
  })
}

/**
 * Hook to post a reply to a comment
 */
export function useReplyToComment(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation<CommentReply, Error, { commentId: string; body: ReplyRequest }>({
    mutationFn: ({ commentId, body }) => replyToComment(teamId, commentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', teamId] })
    },
  })
}

/**
 * Hook to bulk reply to comments
 */
export function useBulkReplyComments(teamId: string) {
  const queryClient = useQueryClient()
  return useMutation<BulkReplyResponse, Error, BulkReplyRequest>({
    mutationFn: (body) => bulkReplyComments(teamId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', teamId] })
    },
  })
}

/**
 * Hook to fetch AI reply suggestions for a comment
 */
export function useReplySuggestions(
  teamId: string,
  commentId: string
) {
  return useQuery<{
    commentId: string
    suggestions: Array<{ id: string; text: string; score: number }>
  }, Error>({
    queryKey: ['replySuggestions', teamId, commentId],
    queryFn: () => getReplySuggestions(teamId, commentId),
    enabled: !!commentId,
  })
}
