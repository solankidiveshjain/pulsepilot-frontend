// @ts-nocheck
/// <reference types="vitest" />
import { mockPosts } from "@/lib/mock-data";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePostById, usePosts } from "./posts";

// Mock TanStack Query
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const original = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...original,
    useQuery: vi.fn(),
    useInfiniteQuery: vi.fn(),
  };
});

const mockedUseQuery = vi.mocked(useQuery);
const mockedUseInfiniteQuery = vi.mocked(useInfiniteQuery);

describe("usePosts", () => {
  beforeEach(() => {
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
    } as any);

    const { result } = renderHook(() => usePosts({ userId: "1" }));
    expect(result.current.isLoading).toBe(true);
  });

  it("should return data on successful fetch", async () => {
    const pages = [{ posts: mockPosts, nextCursor: undefined }];
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

    const { result } = renderHook(() => usePosts({ userId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual(pages);
    expect(result.current.posts).toEqual(mockPosts); // Check flattened posts
  });

  it("should return an error state when fetch fails", async () => {
    const error = new Error("Failed to fetch posts");
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

    const { result } = renderHook(() => usePosts({ userId: "1" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });

  it("should handle empty data correctly", async () => {
    const pages = [{ posts: [], nextCursor: undefined }];
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

    const { result } = renderHook(() => usePosts({ userId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual(pages);
    expect(result.current.posts).toEqual([]);
  });

  it("should call fetchNextPage for pagination", async () => {
    const fetchNextPageMock = vi.fn();
    const initialPages = [{ posts: mockPosts.slice(0, 2), nextCursor: "cursor1" }];
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

    const { result } = renderHook(() => usePosts({ userId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
  });
});

describe("usePostById", () => {
  beforeEach(() => {
    mockedUseQuery.mockReset();
  });

  it("should return loading state initially", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => usePostById({ postId: "1" }));
    expect(result.current.isLoading).toBe(true);
  });

  it("should return data on successful fetch", async () => {
    const post = mockPosts[0];
    mockedUseQuery.mockReturnValue({
      data: post,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => usePostById({ postId: "1" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.post).toEqual(post);
  });

  it("should return an error state when fetch fails", async () => {
    const error = new Error("Failed to fetch post");
    mockedUseQuery.mockReturnValue({
      data: undefined,
      error: error,
      isLoading: false,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => usePostById({ postId: "1" }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });

  it("should return undefined if post not found (successful fetch but no data)", async () => {
    mockedUseQuery.mockReturnValue({
      data: undefined, // Simulate API returning nothing for a given ID
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => usePostById({ postId: "non-existent-id" }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.post).toBeUndefined();
  });
});
