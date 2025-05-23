import { mockProfile } from '@/lib/mock-data'
import type { Profile } from '@/types'
import { get } from './apiClient'
import { useMock } from './config'

/**
 * Fetch the user's profile and team settings
 */
export async function getUserProfile(teamId: string): Promise<Profile> {
  if (useMock) {
    return Promise.resolve(mockProfile)
  }
  return get<Profile>(`/teams/${teamId}/profile`)
}
