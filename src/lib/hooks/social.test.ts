// src/lib/hooks/social.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useSocialConnections } from './social'; // Assuming this is the primary hook
import { mockUsers } from '../../mock-data'; // Assuming it returns user-like data

// Mock TanStack Query
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const original = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...original,
    useQuery: vi.fn(),
    useInfiniteQuery: vi.fn(),
  };
});

const mockedUseQuery = vi.mocked(useQuery);
const mockedUseInfiniteQuery = vi.mocked(useInfiniteQuery);

describe('useSocialConnections', () => {
  beforeEach(() => {
    // Reset mocks before each test. 
    // useSocialConnections seems to use useInfiniteQuery based on its structure in social.ts
    mockedUseInfiniteQuery.mockReset();
  });

  it('should return loading state initially', () => {
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

    const { result } = renderHook(() => useSocialConnections({ userId: '1', type: 'followers' }));
    expect(result.current.isLoading).toBe(true);
  });

  it('should return data on successful fetch', async () => {
    // Simulating that social connections are users
    const pages = [{ users: mockUsers, nextCursor: undefined }]; 
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

    const { result } = renderHook(() => useSocialConnections({ userId: '1', type: 'followers' }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual(pages);
    // Check flattened connections (assuming the hook flattens them into a 'connections' array)
    expect(result.current.connections).toEqual(mockUsers); 
  });

  it('should return an error state when fetch fails', async () => {
    const error = new Error('Failed to fetch social connections');
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

    const { result } = renderHook(() => useSocialConnections({ userId: '1', type: 'followers' }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });

  it('should handle empty data correctly', async () => {
    const pages = [{ users: [], nextCursor: undefined }];
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

    const { result } = renderHook(() => useSocialConnections({ userId: '1', type: 'followers' }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual(pages);
    expect(result.current.connections).toEqual([]);
  });

  it('should call fetchNextPage for pagination', async () => {
    const fetchNextPageMock = vi.fn();
    const initialPages = [{ users: mockUsers.slice(0, 2), nextCursor: 'cursor1' }];
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

    const { result } = renderHook(() => useSocialConnections({ userId: '1', type: 'followers' }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();
    expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
  });
});
