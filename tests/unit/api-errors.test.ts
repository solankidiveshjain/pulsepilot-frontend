import {
  ApiError,
  createQueryString,
  handleApiResponse,
  retryApiCall,
} from "@/lib/utils/api-errors";

// Mock the fetch Response class if not available in test environment
global.Response =
  global.Response ||
  class Response {
    status: number;
    statusText: string;
    headers: Headers;
    body: string | Record<string, unknown>;
    ok: boolean;

    constructor(body: string | Record<string, unknown>, init?: ResponseInit) {
      this.status = init?.status || 200;
      this.statusText = init?.statusText || "";
      this.headers = new Headers(init?.headers);
      this.body = body;
      this.ok = this.status >= 200 && this.status < 300;
    }

    json() {
      if (typeof this.body === "string") {
        try {
          return Promise.resolve(JSON.parse(this.body));
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return Promise.resolve(this.body);
    }
  };

describe("ApiError", () => {
  it("creates error with correct properties", () => {
    const error = new ApiError("Test error", 404, "Not Found", { details: "Test details" });

    expect(error.message).toBe("Test error");
    expect(error.status).toBe(404);
    expect(error.statusText).toBe("Not Found");
    expect(error.data).toEqual({ details: "Test details" });
    expect(error.name).toBe("ApiError");
  });
});

describe("handleApiResponse", () => {
  // Simulate a Response object for successful response
  const createSuccessResponse = (data: Record<string, unknown>) =>
    new Response(JSON.stringify(data), {
      status: 200,
      statusText: "OK",
      headers: { "Content-Type": "application/json" },
    });

  // Simulate a Response object for error response
  const createErrorResponse = (
    status: number,
    statusText: string,
    data?: Record<string, unknown>
  ) =>
    new Response(data ? JSON.stringify(data) : "", {
      status,
      statusText,
      headers: data ? { "Content-Type": "application/json" } : {},
    });

  it("returns parsed data for successful response", async () => {
    const mockData = { id: 123, name: "Test" };
    const response = createSuccessResponse(mockData);

    const result = await handleApiResponse(response);
    expect(result).toEqual(mockData);
  });

  it("throws ApiError for failed response with JSON error data", async () => {
    const errorData = { message: "Custom error message", code: "NOT_FOUND" };
    const response = createErrorResponse(404, "Not Found", errorData);

    await expect(handleApiResponse(response)).rejects.toThrow(ApiError);
    await expect(handleApiResponse(response)).rejects.toMatchObject({
      message: "Custom error message",
      status: 404,
      statusText: "Not Found",
      data: errorData,
    });
  });

  it("throws ApiError for failed response without JSON error data", async () => {
    const response = createErrorResponse(500, "Internal Server Error");

    await expect(handleApiResponse(response)).rejects.toThrow(ApiError);
    await expect(handleApiResponse(response)).rejects.toMatchObject({
      message: "Internal Server Error",
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("throws ApiError if JSON parsing fails", async () => {
    // Create a response with invalid JSON
    const response = new Response("not valid json", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    await expect(handleApiResponse(response)).rejects.toThrow(ApiError);
    await expect(handleApiResponse(response)).rejects.toMatchObject({
      message: "Failed to parse response data",
      status: 500,
      statusText: "Parser Error",
    });
  });
});

// Mock retryApiCall implementation for testing
jest.mock("@/lib/utils/api-errors", () => {
  const originalModule = jest.requireActual("@/lib/utils/api-errors");

  return {
    ...originalModule,
    retryApiCall: async (apiCall, retries = 3) => {
      try {
        return await apiCall();
      } catch (error) {
        if (
          retries <= 0 ||
          !(error instanceof originalModule.ApiError) ||
          (error.status >= 400 && error.status < 500)
        ) {
          throw error;
        }

        // No delay in tests
        return originalModule.retryApiCall(apiCall, retries - 1, 0);
      }
    },
  };
});

describe("retryApiCall", () => {
  it("returns result if API call succeeds", async () => {
    const apiCall = jest.fn().mockResolvedValue({ success: true });

    const result = await retryApiCall(apiCall);

    expect(result).toEqual({ success: true });
    expect(apiCall).toHaveBeenCalledTimes(1);
  });

  it("retries the call on server error", async () => {
    const apiCall = jest
      .fn()
      .mockRejectedValueOnce(new ApiError("Server Error", 500, "Server Error"))
      .mockResolvedValueOnce({ success: true });

    const result = await retryApiCall(apiCall);

    expect(result).toEqual({ success: true });
    expect(apiCall).toHaveBeenCalledTimes(2);
  });

  it("does not retry on client error (4xx)", async () => {
    const apiCall = jest.fn().mockRejectedValue(new ApiError("Not Found", 404, "Not Found"));

    await expect(retryApiCall(apiCall)).rejects.toThrow(ApiError);
    expect(apiCall).toHaveBeenCalledTimes(1);
  });

  it("gives up after maximum retries", async () => {
    const apiCall = jest.fn().mockRejectedValue(new ApiError("Server Error", 500, "Server Error"));

    await expect(retryApiCall(apiCall, 2)).rejects.toThrow(ApiError);
    expect(apiCall).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });
});

describe("createQueryString", () => {
  it("creates empty string for empty params", () => {
    expect(createQueryString({})).toBe("");
  });

  it("creates query string with single parameter", () => {
    expect(createQueryString({ page: 1 })).toBe("?page=1");
  });

  it("creates query string with multiple parameters", () => {
    const result = createQueryString({ page: 1, limit: 10 });
    // Order might vary, so check for both possibilities
    expect(result === "?page=1&limit=10" || result === "?limit=10&page=1").toBeTruthy();
  });

  it("handles array values", () => {
    expect(createQueryString({ platforms: ["youtube", "instagram"] })).toBe(
      "?platforms=youtube%2Cinstagram"
    );
  });

  it("handles object values by stringifying", () => {
    expect(createQueryString({ filter: { status: "active" } })).toBe(
      "?filter=%7B%22status%22%3A%22active%22%7D"
    );
  });

  it("skips null and undefined values", () => {
    expect(createQueryString({ page: 1, filter: null, sort: undefined })).toBe("?page=1");
  });
});
