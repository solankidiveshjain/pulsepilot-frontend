import type { ListPostsParams } from '@/components/posts/models/api'
import { listPosts, previewPost } from '@/lib/api/postsService'
import type { ImagePreview, Pagination, Post, TextPreview, VideoPreview } from '@/types'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to fetch a list of posts for a team
 */
export function usePosts(
  teamId: string,
  params?: ListPostsParams
) {
  return useQuery<{ items: Post[]; pagination: Pagination }, Error>({
    queryKey: ['posts', teamId, params],
    queryFn: () => listPosts(teamId, params || {} as ListPostsParams),
  })
}

/**
 * Hook to fetch a preview for a post
 */
export function usePostPreview(
  teamId: string,
  postId: string
) {
  return useQuery<TextPreview | ImagePreview | VideoPreview, Error>({
    queryKey: ['post', teamId, postId, 'preview'],
    queryFn: () => previewPost(teamId, postId),
    enabled: !!postId,
  })
}