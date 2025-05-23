import type {
  ApiComment,
  BulkReplyRequest,
  BulkReplyResponse,
  CommentsResponse,
  ListCommentsParams,
  ReplyRequest,
  ReplyResponse,
  SuggestionsResponse
} from '@/components/comments/models/api'
import { mockComments } from '@/lib/mock-data'
import type { Comment, CommentReply, Pagination, Platform } from '@/types'
import { get, post } from './apiClient'
import { useMock } from './config'

type ParamsRecord = Record<string, string | number | boolean>

/**
 * Fetch list of comments for a team, mapping API raw to UI Comment
 */
export async function listComments(
  teamId: string,
  params?: ListCommentsParams
): Promise<{ items: Comment[]; pagination: Pagination }> {
  if (useMock) {
    const raw: ApiComment[] = mockComments.map((c) => ({
      id: c.id,
      postId: c.postId,
      author: c.author.name,
      message: c.text,
      createdAt: new Date().toISOString(),
      archived: c.archived,
      flagged: c.flagged,
      metadata: {},
    }))
    const items: Comment[] = raw.map((c) => ({
      id: c.id,
      author: { name: c.author, avatar: '' },
      text: c.message,
      platform: (c.metadata?.platform as Platform) ?? 'youtube',
      time: c.createdAt,
      timeTooltip: c.createdAt,
      likes: 0,
      replies: 0,
      flagged: c.flagged,
      needsAttention: false,
      archived: c.archived,
      postId: c.postId,
      postTitle: '',
      postThumbnail: '',
      emotion: 'neutral',
      sentiment: 'neutral',
      category: 'general',
    }))
    return Promise.resolve({
      items,
      pagination: {
        page: 1,
        pageSize: items.length,
        totalItems: items.length,
        totalPages: 1,
      },
    })
  }

  const rawData = await get<CommentsResponse>(
    `/teams/${teamId}/comments`,
    params as ParamsRecord
  )
  const items: Comment[] = rawData.items.map((c) => ({
    id: c.id,
    author: { name: c.author, avatar: '' },
    text: c.message,
    platform: (c.metadata?.platform as Platform) ?? 'youtube',
    time: c.createdAt,
    timeTooltip: c.createdAt,
    likes: 0,
    replies: 0,
    flagged: c.flagged,
    needsAttention: false,
    archived: c.archived,
    postId: c.postId,
    postTitle: '',
    postThumbnail: '',
    emotion: 'neutral',
    sentiment: 'neutral',
    category: 'general',
  }))
  return { items, pagination: rawData.pagination }
}

/**
 * Reply to a specific comment
 */
export async function replyToComment(
  teamId: string,
  commentId: string,
  body: ReplyRequest
): Promise<CommentReply> {
  if (useMock) {
    const now = new Date().toISOString()
    return Promise.resolve({
      id: `mock-reply-${Math.random().toString(36).substr(2, 9)}`,
      author: { name: 'Mock User', avatar: '' },
      text: body.message,
      time: now,
      timeTooltip: now,
      likes: 0,
    })
  }
  const raw = await post<ReplyResponse>(
    `/teams/${teamId}/comments/${commentId}/reply`,
    body
  )
  return {
    id: raw.id,
    author: { name: 'You', avatar: '' },
    text: raw.message,
    time: raw.createdAt,
    timeTooltip: raw.createdAt,
    likes: 0,
  }
}

/**
 * Bulk reply to multiple comments
 */
export async function bulkReplyComments(
  teamId: string,
  body: BulkReplyRequest
): Promise<BulkReplyResponse> {
  if (useMock) {
    const results = body.commentIds.map((id) => ({ commentId: id, status: 'success' }))
    return Promise.resolve({ results })
  }

  return post<BulkReplyResponse>(
    `/teams/${teamId}/comments/bulk-reply`,
    body
  )
}

/**
 * Get AI-generated reply suggestions for a comment
 */
export async function getReplySuggestions(
  teamId: string,
  commentId: string
): Promise<SuggestionsResponse> {
  if (useMock) {
    return Promise.resolve({
      commentId,
      suggestions: [
        { id: 's1', text: 'Thank you for your feedback!', score: 1 },
        { id: 's2', text: 'We appreciate your comment and will take it into consideration.', score: 1 }
      ]
    })
  }

  return get<SuggestionsResponse>(
    `/teams/${teamId}/comments/${commentId}/suggestions`
  )
}
