import type { Profile } from '@/types'

/**
 * Path parameters for fetching user profile
 */
export interface UserProfileParams {
  teamId: string
}

/**
 * Response payload for fetching user profile
 */
export type UserProfileResponse = Profile
