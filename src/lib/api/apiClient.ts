import ky, { HTTPError } from 'ky'
import { API_BASE_URL } from './config'

// Create a ky instance with defaults for timeout, retries, and hooks
const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000, // 10s timeout
  retry: { limit: 2 }, // retry up to 2 times on network/server errors
  hooks: {
    beforeRequest: [
      (request, options) => {
        // TODO: inject auth header here, e.g.
        // request.headers.set('Authorization', `Bearer ${token}`)
      }
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (!response.ok) {
          throw new HTTPError(response, _request, _options)
        }
      }
    ]
  }
})

/**
 * Perform a GET request
 */
export function get<T>(
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  return api.get(path, { searchParams: params }).json<T>()
}

/**
 * Perform a POST request
 */
export function post<T>(path: string, body: unknown): Promise<T> {
  return api.post(path, { json: body }).json<T>()
}

/**
 * Perform a PUT request
 */
export function put<T>(path: string, body: unknown): Promise<T> {
  return api.put(path, { json: body }).json<T>()
}

/**
 * Perform a DELETE request
 */
export function del<T>(path: string): Promise<T> {
  return api.delete(path).json<T>()
}
