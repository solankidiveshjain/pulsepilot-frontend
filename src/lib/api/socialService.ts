import type { ConnectionResponse, OffboardConnectionParams, OnboardConnectionRequest, PlatformConnectionParams } from '@/components/social/models/api'
import { del, post } from './apiClient'
import { useMock } from './config'

/**
 * Connects a social media platform for a team
 */
export async function onboardPlatform(
  params: PlatformConnectionParams,
  body: OnboardConnectionRequest
): Promise<ConnectionResponse> {
  if (useMock) {
    return Promise.resolve({
      id: 'mock-connection',
      platform: params.platform,
      status: 'connected',
      createdAt: new Date().toISOString(),
      metadata: {},
    })
  }

  return post<ConnectionResponse>(
    `/teams/${params.teamId}/platforms/${params.platform}/connections`,
    body
  )
}

/**
 * Disconnects a social media platform for a team
 */
export async function offboardPlatform(
  params: OffboardConnectionParams
): Promise<void> {
  if (useMock) {
    return Promise.resolve()
  }

  return del<void>(
    `/teams/${params.teamId}/platforms/${params.platform}/connections/${params.connectionId}`
  )
}
