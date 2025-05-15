/**
 * Custom API error class with additional context
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(message: string, status: number, statusText: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Function to handle API response errors consistently
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: unknown;
    let errorMessage = response.statusText;

    try {
      // Try to parse error data from JSON response
      errorData = await response.json();
      if (
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof errorData.message === "string"
      ) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If parsing fails, use status text
      console.error("Failed to parse error response:", e);
    }

    throw new ApiError(errorMessage, response.status, response.statusText, errorData);
  }

  try {
    return (await response.json()) as T;
  } catch (e) {
    throw new ApiError("Failed to parse response data", 500, "Parser Error", e);
  }
}

/**
 * Retry function for API calls with exponential backoff
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    if (
      retries <= 0 ||
      !(error instanceof ApiError) ||
      (error.status >= 400 && error.status < 500)
    ) {
      // Don't retry on client errors (4xx) or if no retries left
      throw error;
    }

    // Wait with exponential backoff
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry with increased delay
    return retryApiCall(apiCall, retries - 1, delay * 2);
  }
}

/**
 * Creates a properly formatted query string from params object
 */
export function createQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        searchParams.append(key, value.join(","));
      }
    } else if (typeof value === "object") {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
