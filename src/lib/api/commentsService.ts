import { mockComments } from '@/lib/mock-data'
import type { Comment, CommentReply, Pagination } from '@/types'
import { get, post } from './apiClient'
import { useMock } from './config'

/**
 * Parameters for listing comments
 */
export interface ListCommentsParams {
  archived?: boolean
  flagged?: boolean
  page?: number
  pageSize?: number
}

/**
 * Response for listing comments
 */
export interface CommentsResponse {
  items: Comment[]
  pagination: Pagination
}

type ParamsRecord = Record<string, string | number | boolean>

/**
 * Fetch list of comments for a team
 */
export async function listComments(
  teamId: string,
  params?: ListCommentsParams
): Promise<CommentsResponse> {
  if (useMock) {
    return Promise.resolve({
      items: mockComments,
      pagination: {
        page: 1,
        pageSize: mockComments.length,
        totalItems: mockComments.length,
        totalPages: 1,
      },
    })
  }

  return get<CommentsResponse>(`/teams/${teamId}/comments`, params as ParamsRecord)
}

/**
 * Reply to a specific comment
 */
export async function replyToComment(
  teamId: string,
  commentId: string,
  message: string
): Promise<CommentReply> {
  if (useMock) {
    const now = new Date().toISOString()
    return Promise.resolve({
      id: `mock-reply-${Math.random().toString(36).substr(2, 9)}`,
      author: { name: 'Mock User', avatar: '' },
      text: message,
      time: now,
      timeTooltip: now,
      likes: 0,
    })
  }

  const response = await post<{ id: string; commentId: string; message: string; createdAt: string }>(
    `/teams/${teamId}/comments/${commentId}/reply`,
    { message }
  )

  return {
    id: response.id,
    author: { name: 'You', avatar: '' },
    text: response.message,
    time: response.createdAt,
    timeTooltip: response.createdAt,
    likes: 0,
  }
}

/**
 * Bulk reply result
 */
export interface BulkReplyResult {
  commentId: string
  status: string
  error?: string
}

/**
 * Bulk reply response
 */
export interface BulkReplyResponse {
  results: BulkReplyResult[]
}

/**
 * Bulk reply to multiple comments
 */
export async function bulkReplyComments(
  teamId: string,
  commentIds: string[],
  message: string,
  strategy: 'parallel' | 'sequential' = 'parallel'
): Promise<BulkReplyResponse> {
  if (useMock) {
    const results = commentIds.map((id) => ({ commentId: id, status: 'success' }))
    return Promise.resolve({ results })
  }

  return post<BulkReplyResponse>(`/teams/${teamId}/comments/bulk-reply`, {
    commentIds,
    message,
    strategy,
  })
}

/**
 * Get AI-generated reply suggestions for a comment
 */
export async function getReplySuggestions(
  teamId: string,
  commentId: string
): Promise<string[]> {
  if (useMock) {
    return Promise.resolve([
      'Thank you for your feedback!',
      'We appreciate your comment and will take it into consideration.',
    ])
  }

  const response = await get<{ commentId: string; suggestions: { id: string; text: string; score: number }[] }>(
    `/teams/${teamId}/comments/${commentId}/suggestions`
  )

  return response.suggestions.map((s) => s.text)
}
