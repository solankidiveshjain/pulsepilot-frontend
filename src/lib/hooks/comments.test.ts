/// <reference types="vitest" />
import { mockComments } from "@/lib/mock-data";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useComments } from "./comments";

// Mock TanStack Query
vi.mock("@tanstack/react-query", async (importOriginal: any) => {
  const original = await importOriginal();
  return {
    ...original,
    useQuery: vi.fn(),
    useInfiniteQuery: vi.fn(),
  };
});

const mockedUseQuery = vi.mocked(useQuery);
const mockedUseInfiniteQuery = vi.mocked(useInfiniteQuery);

describe("useComments", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedUseQuery.mockReset();
    mockedUseInfiniteQuery.mockReset();
  });

  it("should return loading state initially", () => {
    mockedUseInfiniteQuery.mockReturnValue({
      data: undefined,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: true,
      isError: false,
      isSuccess: false,
    } as any); // Use 'as any' to simplify mock structure for this test

    const { result } = renderHook(() => useComments({ postId: "1" }));
    expect(result.current.isLoading).toBe(true);
  });

  it("should return data on successful fetch", async () => {
    const pages = [{ comments: mockComments, nextCursor: undefined }];
    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages, pageParams: [undefined] },
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useComments({ postId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual(pages);
    // Check flattened comments
    expect(result.current.comments).toEqual(mockComments);
  });

  it("should return an error state when fetch fails", async () => {
    const error = new Error("Failed to fetch comments");
    mockedUseInfiniteQuery.mockReturnValue({
      data: undefined,
      error: error,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useComments({ postId: "1" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });

  it("should handle empty data correctly", async () => {
    const pages = [{ comments: [], nextCursor: undefined }];
    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages, pageParams: [undefined] },
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useComments({ postId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual(pages);
    expect(result.current.comments).toEqual([]);
  });

  it("should call fetchNextPage for pagination", async () => {
    const fetchNextPageMock = vi.fn();
    const initialPages = [{ comments: mockComments.slice(0, 2), nextCursor: "cursor1" }];
    mockedUseInfiniteQuery.mockReturnValue({
      data: { pages: initialPages, pageParams: [undefined] },
      error: null,
      fetchNextPage: fetchNextPageMock,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useComments({ postId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
  });
});
