import { mockPosts } from '@/lib/mock-data'
import type { ImagePreview, Pagination, Post, TextPreview, VideoPreview } from '@/types'
import { get } from './apiClient'
import { useMock } from './config'

/**
 * Parameters for listing posts
 */
export interface ListPostsParams {
  idsOnly?: boolean
  page?: number
  pageSize?: number
}

/**
 * Response for listing posts
 */
export interface PostsResponse {
  items: Post[]
  pagination: Pagination
}

/**
 * Fetch list of posts for a team
 */
export async function listPosts(
  teamId: string,
  params?: ListPostsParams
): Promise<PostsResponse> {
  if (useMock) {
    return Promise.resolve({
      items: mockPosts,
      pagination: {
        page: 1,
        pageSize: mockPosts.length,
        totalItems: mockPosts.length,
        totalPages: 1,
      },
    })
  }

  return get<PostsResponse>(
    `/teams/${teamId}/posts`,
    params as Record<string, string | number | boolean>
  )
}

/**
 * Preview a specific post
 */
export async function previewPost(
  teamId: string,
  postId: string
): Promise<TextPreview | ImagePreview | VideoPreview> {
  if (useMock) {
    return Promise.resolve({ type: 'text', content: 'This is a mock preview.' })
  }

  return get<unknown>(`/teams/${teamId}/posts/${postId}/preview`) as Promise<
    TextPreview | ImagePreview | VideoPreview
  >
}
