import type { UserProfileResponse } from '@/components/profile/models/api'
import { getUserProfile } from '@/lib/api/profileService'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to fetch a user's profile and team settings
 */
export function useUserProfile(teamId: string) {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ['profile', teamId],
    queryFn: () => getUserProfile(teamId),
  })
}