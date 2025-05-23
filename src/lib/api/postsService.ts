import type { ApiPostMetadata, ListPostsParams, PostPreview } from '@/components/posts/models/api'
import { mockPosts } from '@/lib/mock-data'
import type { Pagination, Post } from '@/types'
import { get } from './apiClient'
import { useMock } from './config'

/**
 * Fetch list of posts for a team, mapping API metadata to UI Post objects
 */
export async function listPosts(
  teamId: string,
  params?: ListPostsParams
): Promise<{ items: Post[]; pagination: Pagination }> {
  if (useMock) {
    const items: Post[] = mockPosts
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

  const raw = await get<{ items: ApiPostMetadata[]; pagination: Pagination }>(
    `/teams/${teamId}/posts`,
    params as Record<string, string | number | boolean>
  )
  const items: Post[] = raw.items.map((m) => ({
    id: m.id,
    title: '', // TODO: map title from API
    thumbnail: '',
    platform: m.platform,
    date: m.createdAt,
    caption: '',
    likes: 0,
    comments: 0,
    views: '',
    url: '',
  }))
  return { items, pagination: raw.pagination }
}

/**
 * Preview a specific post
 */
export async function previewPost(
  teamId: string,
  postId: string
): Promise<PostPreview> {
  if (useMock) {
    return Promise.resolve({ type: 'text', content: 'This is a mock preview.' })
  }

  return get<PostPreview>(`/teams/${teamId}/posts/${postId}/preview`)
}
