import type { ImagePreview, Pagination, TextPreview, VideoPreview } from '@/types'

/**
 * Raw post metadata returned by the API
 */
export interface ApiPostMetadata {
  id: string
  platform: string
  createdAt: string
  type: 'text' | 'image' | 'video' | 'link'
}

/**
 * Query parameters for listing posts
 */
export interface ListPostsParams {
  idsOnly?: boolean
  page?: number
  pageSize?: number
}

/**
 * Response payload for listing posts
 */
export interface PostsResponse {
  items: ApiPostMetadata[]
  pagination: Pagination
}

/**
 * Preview response for a post (text, image, or video)
 */
export type PostPreview = TextPreview | ImagePreview | VideoPreview
