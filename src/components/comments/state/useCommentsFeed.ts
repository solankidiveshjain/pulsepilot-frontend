import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Comment, CommentFilter, CommentMetrics } from "../models";
import { useCommentsStore, useFilters, useLoadingState } from "./useCommentsStore";

// Type for paginated API response
interface PaginatedCommentsResponse {
  data: Comment[];
  nextPage: number | null;
}

// Mock data for development
const MOCK_COMMENTS: Comment[] = [
  {
    commentId: "comment1",
    postId: "post1",
    content:
      "This is a great post! I really enjoyed reading it and learned a lot from the content. Keep up the good work!",
    author: {
      id: "user1",
      name: "John Doe",
      avatarUrl: "https://ui-avatars.com/api/?name=John+Doe",
      isVerified: true,
    },
    platform: "facebook",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    likes: 42,
    replies: 5,
    sentiment: "positive",
    emotions: ["joy"],
    categories: ["praise"],
    isRead: false,
    isFlagged: false,
  },
  {
    commentId: "comment2",
    postId: "post1",
    content: "I disagree with some points in this article. The data seems misleading.",
    author: {
      id: "user2",
      name: "Jane Smith",
      avatarUrl: "https://ui-avatars.com/api/?name=Jane+Smith",
      isVerified: false,
    },
    platform: "twitter",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    likes: 8,
    replies: 2,
    sentiment: "negative",
    emotions: ["anger"],
    categories: ["feedback"],
    isRead: true,
    isFlagged: true,
    parentId: null,
  },
  {
    commentId: "comment3",
    postId: "post2",
    content: "When is the next update coming out?",
    author: {
      id: "user3",
      name: "Alex Johnson",
      avatarUrl: "https://ui-avatars.com/api/?name=Alex+Johnson",
      isVerified: false,
    },
    platform: "instagram",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likes: 3,
    replies: 1,
    sentiment: "neutral",
    emotions: ["surprise"],
    categories: ["question"],
    isRead: false,
    isFlagged: false,
    parentId: null,
  },
  {
    commentId: "comment4",
    postId: "post2",
    content: "I found a bug in your latest release. The button on the homepage doesn't work.",
    author: {
      id: "user4",
      name: "Taylor Wilson",
      avatarUrl: "https://ui-avatars.com/api/?name=Taylor+Wilson",
      isVerified: false,
    },
    platform: "youtube",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    likes: 15,
    replies: 0,
    sentiment: "negative",
    emotions: ["frustration"],
    categories: ["bug"],
    isRead: true,
    isFlagged: false,
    parentId: null,
  },
  {
    commentId: "comment5",
    postId: "post3",
    content: "This is exactly what I've been looking for! Thank you.",
    author: {
      id: "user5",
      name: "Morgan Lee",
      avatarUrl: "https://ui-avatars.com/api/?name=Morgan+Lee",
      isVerified: true,
    },
    platform: "facebook",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 27,
    replies: 3,
    sentiment: "positive",
    emotions: ["joy"],
    categories: ["praise"],
    isRead: false,
    isFlagged: false,
    parentId: null,
  },
  // Child comments (replies)
  {
    commentId: "reply1",
    postId: "post1",
    content: "I agree with your points about the article.",
    author: {
      id: "user6",
      name: "Chris Black",
      avatarUrl: "https://ui-avatars.com/api/?name=Chris+Black",
      isVerified: false,
    },
    platform: "twitter",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 minutes ago
    likes: 3,
    replies: 0,
    sentiment: "positive",
    emotions: ["agreement"],
    categories: ["feedback"],
    isRead: false,
    isFlagged: false,
    parentId: "comment2",
  },
  {
    commentId: "reply2",
    postId: "post1",
    content: "Thanks for bringing this up. We'll look into it.",
    author: {
      id: "user7",
      name: "Admin User",
      avatarUrl: "https://ui-avatars.com/api/?name=Admin+User",
      isVerified: true,
    },
    platform: "twitter",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    likes: 5,
    replies: 0,
    sentiment: "neutral",
    emotions: ["gratitude"],
    categories: ["feedback"],
    isRead: true,
    isFlagged: false,
    parentId: "comment2",
  },
];

const MOCK_METRICS: CommentMetrics = {
  total: 7,
  unread: 4,
  flagged: 1,
  platforms: {
    facebook: 2,
    twitter: 3,
    instagram: 1,
    youtube: 1,
  },
  sentiments: {
    positive: 3,
    negative: 2,
    neutral: 2,
  },
  emotions: {
    joy: 2,
    anger: 1,
    surprise: 1,
    frustration: 1,
    agreement: 1,
    gratitude: 1,
  },
  categories: {
    praise: 2,
    feedback: 3,
    question: 1,
    bug: 1,
  },
};

// Mock API client - simulates API calls with mock data
const commentsApi = {
  getComments: async (
    filter: CommentFilter = {},
    page = 1,
    limit = 20
  ): Promise<PaginatedCommentsResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Clone the mock data to avoid mutations
    let filteredComments = [...MOCK_COMMENTS];

    // Apply filters
    if (filter.platform && filter.platform.length > 0) {
      filteredComments = filteredComments.filter((comment) =>
        filter.platform!.includes(comment.platform)
      );
    }

    if (filter.read === false) {
      filteredComments = filteredComments.filter((comment) => !comment.isRead);
    }

    if (filter.flagged === true) {
      filteredComments = filteredComments.filter((comment) => comment.isFlagged);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredComments = filteredComments.filter(
        (comment) =>
          comment.content.toLowerCase().includes(searchLower) ||
          comment.author.name.toLowerCase().includes(searchLower)
      );
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);
    const hasMore = filteredComments.length > endIndex;

    return {
      data: paginatedComments,
      nextPage: hasMore ? page + 1 : null,
    };
  },

  getCommentMetrics: async (filter: CommentFilter = {}): Promise<CommentMetrics> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // In a real implementation, metrics would be calculated based on filters
    // For demo purposes, we'll just return the mock metrics
    return MOCK_METRICS;
  },

  bulkAction: async (action: string, commentIds: string[]): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(`Performed ${action} on comments:`, commentIds);
    // In a real implementation, this would update the server state
  },
};

// Export a test function for direct API testing
export async function testDirectApi(): Promise<PaginatedCommentsResponse> {
  console.log("Direct API test function called");
  return commentsApi.getComments({}, 1, 10);
}

export function useCommentsFeed() {
  const { filters, updateFilters, clearAllFilters } = useFilters();
  const { setLoadingState, setFetchingNextPage, setHasNextPage, setError } = useLoadingState();
  const setComments = useCommentsStore((state) => state.setComments);

  console.log("useCommentsFeed hook executing with filters:", filters);

  // Use React Query's useInfiniteQuery for pagination
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["comments", filters],
      queryFn: ({ pageParam = 1 }) => fetchComments({ page: pageParam, filters }),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  // Load the mock comments directly as a workaround
  useEffect(() => {
    const loadMockDataDirectly = async () => {
      console.log("Loading mock data directly as workaround");
      try {
        setLoadingState(true);
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Set comments directly from the mock data
        setComments(MOCK_COMMENTS);
        setLoadingState(false);
        setHasNextPage(false);
        console.log("Successfully set comments directly:", MOCK_COMMENTS.length, "comments");
      } catch (error) {
        console.error("Error setting comments directly:", error);
        setError(true);
        setLoadingState(false);
      }
    };

    // Only run this if the React Query isn't providing data
    if (isLoading && (!data || data.pages.length === 0)) {
      loadMockDataDirectly();
    }
  }, [data, isLoading, setComments, setError, setHasNextPage, setLoadingState]);

  // Flatten the pages of comments into a single array
  const comments = useMemo(() => {
    console.log(
      "Processing React Query data:",
      data ? `${data.pages.length} pages` : "No data yet"
    );
    const result = data?.pages.flatMap((page) => page.data) || [];
    console.log("Flattened comments array:", result.length, "total comments");
    return result;
  }, [data]);

  // Update the store with the latest comments from React Query if available
  useEffect(() => {
    if (comments.length > 0) {
      console.log("Updating store with comments from React Query:", comments.length);
      setComments(comments);
    }

    setLoadingState(isLoading);
    setFetchingNextPage(isFetchingNextPage);
    setHasNextPage(!!hasNextPage);
    setError(isError);
  }, [
    comments,
    setComments,
    isLoading,
    setLoadingState,
    isFetchingNextPage,
    setFetchingNextPage,
    hasNextPage,
    setHasNextPage,
    isError,
    setError,
  ]);

  // Get comments from store
  const storeComments = useCommentsStore((state) => state.comments);

  return {
    comments: storeComments.length > 0 ? storeComments : comments,
    isLoading,
    isError,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    filters,
    updateFilters,
    clearAllFilters,
    refetch,
  };
}

export function useCommentMetrics() {
  const { filters } = useFilters();
  const setMetrics = useCommentsStore((state) => state.setMetrics);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["commentMetrics", filters],
    queryFn: () => commentsApi.getCommentMetrics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      setMetrics(data);
    }
  }, [data, setMetrics]);

  return {
    metrics: data || {
      total: 0,
      unread: 0,
      flagged: 0,
      platforms: {},
      sentiments: {},
      emotions: {},
      categories: {},
    },
    isLoading,
    isError,
  };
}

export function useBulkActions() {
  const [isPerforming, setIsPerforming] = useState(false);

  const performBulkAction = async (action: string, commentIds: string[]) => {
    if (!commentIds.length) return;

    setIsPerforming(true);
    try {
      await commentsApi.bulkAction(action, commentIds);
      // Invalidate queries to refetch data
      // This would usually be handled by the QueryClient
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    } finally {
      setIsPerforming(false);
    }
  };

  return {
    performBulkAction,
    isPerforming,
  };
}
