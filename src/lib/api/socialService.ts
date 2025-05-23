import type { Connection, ConnectionRequest } from '@/types'
import { del, post } from './apiClient'
import { useMock } from './config'

/**
 * Connect a social media platform for the team
 */
export async function onboardPlatform(
  teamId: string,
  platform: string,
  body: ConnectionRequest
): Promise<Connection> {
  if (useMock) {
    return Promise.resolve({
      id: `mock-conn-${Math.random().toString(36).substr(2, 9)}`,
      platform,
      status: 'connected',
      createdAt: new Date().toISOString(),
      metadata: {},
    })
  }
  return post<Connection>(
    `/teams/${teamId}/platforms/${platform}/connections`,
    body
  )
}

/**
 * Disconnect a social media platform for the team
 */
export async function offboardPlatform(
  teamId: string,
  platform: string,
  connectionId: string
): Promise<void> {
  if (useMock) {
    return Promise.resolve()
  }
  await del<void>(
    `/teams/${teamId}/platforms/${platform}/connections/${connectionId}`
  )
}
