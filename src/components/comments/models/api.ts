import type { Pagination } from '@/types'

/**
 * Query parameters for listing comments
 */
export interface ListCommentsParams {
  archived?: boolean
  flagged?: boolean
  page?: number
  pageSize?: number
}

/**
 * Raw comment returned by the API
 */
export interface ApiComment {
  id: string
  postId: string
  author: string
  message: string
  createdAt: string
  archived: boolean
  flagged: boolean
  metadata?: Record<string, unknown>
}

/**
 * Response payload for listing comments
 */
export interface CommentsResponse {
  items: ApiComment[]
  pagination: Pagination
}

/**
 * Request body for replying to a comment
 */
export interface ReplyRequest {
  message: string
}

/**
 * Response payload for replying to a comment
 */
export interface ReplyResponse {
  id: string
  commentId: string
  message: string
  createdAt: string
}

/**
 * Request body for bulk replying to comments
 */
export interface BulkReplyRequest {
  commentIds: string[]
  message: string
  strategy: 'parallel' | 'sequential'
}

/**
 * Result for a single bulk reply operation
 */
export interface BulkReplyResult {
  commentId: string
  status: string
  error?: string
}

/**
 * Response payload for bulk reply
 */
export interface BulkReplyResponse {
  results: BulkReplyResult[]
}

/**
 * Response payload for reply suggestions
 */
export interface SuggestionsResponse {
  commentId: string
  suggestions: Array<{ id: string; text: string; score: number }>
}
