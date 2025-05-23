import type { UserProfileResponse } from '@/components/profile/models/api'
import { mockProfile } from '@/lib/mock-data'
import { get } from './apiClient'
import { useMock } from './config'

/**
 * Fetch the user's profile and team settings
 */
export async function getUserProfile(teamId: string): Promise<UserProfileResponse> {
  if (useMock) {
    return Promise.resolve(mockProfile)
  }
  return get<UserProfileResponse>(`/teams/${teamId}/profile`)
}
