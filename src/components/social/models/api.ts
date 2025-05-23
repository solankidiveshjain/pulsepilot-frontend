import type { Connection, ConnectionRequest } from '@/types'

/**
 * Path parameters for platform connection operations
 */
export interface PlatformConnectionParams {
  teamId: string
  platform: string
}

/**
 * Request body for onboarding a platform connection
 */
export type OnboardConnectionRequest = ConnectionRequest

/**
 * Response payload for a platform connection
 */
export type ConnectionResponse = Connection

/**
 * Path parameters for offboarding a platform connection
 */
export interface OffboardConnectionParams extends PlatformConnectionParams {
  connectionId: string
}
