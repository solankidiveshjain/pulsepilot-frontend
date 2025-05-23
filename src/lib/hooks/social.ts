import type {
    ConnectionResponse,
    OffboardConnectionParams,
    OnboardConnectionRequest,
    PlatformConnectionParams,
} from '@/components/social/models/api'
import { offboardPlatform, onboardPlatform } from '@/lib/api/socialService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Hook to connect a social media platform for a team
 */
export function useOnboardPlatform() {
  const queryClient = useQueryClient()
  return useMutation<ConnectionResponse, Error, { params: PlatformConnectionParams; body: OnboardConnectionRequest }>({
    mutationFn: ({ params, body }) => onboardPlatform(params, body),
    onSuccess: (_data, { params }) => {
      queryClient.invalidateQueries({ queryKey: ['connections', params.teamId, params.platform] })
    },
  })
}

/**
 * Hook to disconnect a social media platform for a team
 */
export function useOffboardPlatform() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, OffboardConnectionParams>({
    mutationFn: (params) => offboardPlatform(params),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['connections', params.teamId, params.platform] })
    },
  })
}
