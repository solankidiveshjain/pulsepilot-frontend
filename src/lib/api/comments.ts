import {
  BulkActionRequest,
  BulkActionResponse,
  Comment,
  CommentFilters,
  CommentMetrics,
  CommentPlatform,
  CommentThread,
  CommentsResponse,
  MediaType,
  PostPreview,
  PostType,
} from "../types/comments";
import { createQueryString, handleApiResponse, retryApiCall } from "../utils/api-errors";

// Base API URL - should be configured from environment
const API_BASE_URL = process.env["NEXT_PUBLIC_API_URL"] || "https://api.pulsepilot.com";

// Whether to use mock data - set to true during development
const USE_MOCK_DATA = true;

/**
 * Generate simulated API response to mock delays and network conditions
 */
async function mockApiResponse<T>(data: T): Promise<T> {
  // Use a shorter delay in development to make testing faster
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Verify data is valid before returning
  if (data === null || data === undefined) {
    throw new Error("Mock data is null or undefined");
  }

  return data;
}

// Mock user data for testing
const mockUsers = [
  { name: "Jane Smith", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  { name: "John Doe", profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  {
    name: "Sarah Johnson",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Michael Brown",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    name: "Emily Wilson",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
];

// Mock comment text examples
const mockCommentTexts = [
  "This is incredibly helpful content! Thanks for sharing your insights.",
  "I've been following your channel for months and love your approach to these topics.",
  "Have you considered covering strategies for new platform algorithms?",
  "The tips about content scheduling have completely changed my workflow. Much more efficient now!",
  "I disagree with point #3. In my experience, focusing on quality over quantity works better.",
  "Just discovered your content and already subscribed. Keep it up!",
  "Could you clarify how the new updates will affect smaller accounts?",
  "Using these techniques increased my engagement by 40% in just two weeks.",
  "Great information as always. Your explanations are so clear and actionable.",
  "What tools would you recommend for someone just starting out?",
];

// Generate a mock comment
function generateMockComment(id: number): Comment {
  const platforms: CommentPlatform[] = ["youtube", "instagram", "twitter"];
  const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)] as CommentPlatform;

  // Ensure we have a valid user by clamping the index
  const randomUserIndex = Math.min(
    Math.floor(Math.random() * mockUsers.length),
    mockUsers.length - 1
  );
  const randomUser = mockUsers[randomUserIndex];

  const randomTextIndex = Math.min(
    Math.floor(Math.random() * mockCommentTexts.length),
    mockCommentTexts.length - 1
  );
  const randomText = mockCommentTexts[randomTextIndex] || "Nice post!";

  // Create date within the last week
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 7));

  return {
    commentId: `comment-${id}`,
    text: randomText,
    author: {
      name: randomUser.name,
      profileImageUrl: randomUser.profileImageUrl,
      platform: randomPlatform,
    },
    platform: randomPlatform,
    likes: Math.floor(Math.random() * 500),
    repliesCount: Math.floor(Math.random() * 10),
    postedAt: date.toISOString(),
    read: Math.random() > 0.3,
    flagged: Math.random() > 0.8,
    archived: Math.random() > 0.9,
    postId: `post-${Math.floor(Math.random() * 10)}`,
    requiresAttention: Math.random() > 0.7,
  };
}

// Generate a collection of mock comments
const mockCommentData: Comment[] = Array.from({ length: 100 }, (_, i) =>
  generateMockComment(i + 1)
);

/**
 * Fetch comments feed with pagination and filtering support
 */
export async function fetchCommentsFeed(
  page: number = 1,
  cursor?: string,
  filters?: CommentFilters
): Promise<CommentsResponse> {
  const queryParams: Record<string, unknown> = { page };

  if (cursor) {
    queryParams["cursor"] = cursor;
  }

  // Add filters if provided
  if (filters) {
    if (filters.platform?.length) {
      queryParams["platform"] = filters.platform;
    }

    if (filters.flagged !== undefined) {
      queryParams["flagged"] = filters.flagged;
    }

    if (filters.unread !== undefined) {
      queryParams["unread"] = filters.unread;
    }

    if (filters.archived !== undefined) {
      queryParams["archived"] = filters.archived;
    }

    if (filters.requiresAttention !== undefined) {
      queryParams["requiresAttention"] = filters.requiresAttention;
    }

    if (filters.search) {
      queryParams["search"] = filters.search;
    }

    if (filters.dateRange) {
      queryParams["startDate"] = filters.dateRange.start;
      queryParams["endDate"] = filters.dateRange.end;
    }
  }

  const queryString = createQueryString(queryParams);

  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Apply filters
    let filteredComments = [...mockCommentData];

    if (filters) {
      if (filters.flagged !== undefined) {
        filteredComments = filteredComments.filter((c) => c.flagged === filters.flagged);
      }
      if (filters.unread !== undefined) {
        filteredComments = filteredComments.filter((c) => !c.read === filters.unread);
      }
      if (filters.archived !== undefined) {
        filteredComments = filteredComments.filter((c) => c.archived === filters.archived);
      }
      if (filters.platform && filters.platform.length > 0) {
        filteredComments = filteredComments.filter(
          (c) => filters.platform && filters.platform.includes(c.platform)
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredComments = filteredComments.filter(
          (c) =>
            c.text.toLowerCase().includes(search) || c.author.name.toLowerCase().includes(search)
        );
      }
    }

    // Paginate results
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedComments = filteredComments.slice(startIndex, startIndex + itemsPerPage);
    const hasNextPage = startIndex + itemsPerPage < filteredComments.length;

    return mockApiResponse<CommentsResponse>({
      comments: paginatedComments,
      page,
      nextCursor: hasNextPage ? `mock-cursor-${page + 1}` : undefined,
    });
  }

  return retryApiCall(async () => {
    const response = await fetch(`${API_BASE_URL}/comments/feed${queryString}`);
    return handleApiResponse<CommentsResponse>(response);
  });
}

/**
 * Fetch post preview by ID
 */
export async function fetchPostPreview(postId: string): Promise<PostPreview> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Generate a mock post preview
    const platforms: CommentPlatform[] = ["youtube", "instagram", "twitter"];
    const randomPlatform = platforms[
      Math.floor(Math.random() * platforms.length)
    ] as CommentPlatform;
    const mediaTypes: MediaType[] = ["image", "video", "text"];
    const randomMediaType = mediaTypes[Math.floor(Math.random() * mediaTypes.length)] as MediaType;
    const postTypes: PostType[] = ["post", "reel", "story", "video"];
    const randomPostType = postTypes[Math.floor(Math.random() * postTypes.length)] as PostType;

    return mockApiResponse<PostPreview>({
      postId: postId,
      title: `Post about ${postId.slice(0, 10)}`,
      caption: "This is a mock post caption for development purposes.",
      thumbnailUrl: `https://picsum.photos/seed/${postId}/200/200`,
      platform: randomPlatform,
      mediaType: randomMediaType,
      postType: randomPostType,
    });
  }

  return retryApiCall(async () => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    return handleApiResponse<PostPreview>(response);
  });
}

/**
 * Fetch comment thread with replies
 */
export async function fetchCommentThread(commentId: string): Promise<CommentThread> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Find the parent comment to get the actual reply count
    const parentComment = mockCommentData.find((c) => c.commentId === commentId);
    const replyCount = parentComment?.repliesCount || 3;

    // Create a stable set of replies
    const replies = Array.from({ length: replyCount }, (_, i) => {
      // Use default values to avoid undefined errors
      const defaultUser = {
        name: "User Name",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      };

      // Find a user or use default
      const randomUserIndex = Math.min(
        Math.floor(Math.random() * mockUsers.length),
        mockUsers.length - 1
      );
      const user = mockUsers[randomUserIndex] || defaultUser;

      // Find parent comment's platform or default to youtube
      const platform = parentComment?.platform || "youtube";

      // Get a random comment text
      const textIndex = Math.min(
        Math.floor(Math.random() * mockCommentTexts.length),
        mockCommentTexts.length - 1
      );
      const text = mockCommentTexts[textIndex] || "Thanks for sharing!";

      // Create date - more recent than parent
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 3));

      return {
        replyId: `${commentId}-reply-${i + 1}`,
        text,
        postedAt: date.toISOString(),
        author: {
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          platform,
        },
      };
    });

    const result = {
      commentId,
      totalReplies: replies.length,
      replies,
    };

    return mockApiResponse<CommentThread>(result);
  }

  return retryApiCall(async () => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/thread`);
    return handleApiResponse<CommentThread>(response);
  });
}

/**
 * Perform bulk action on comments
 */
export async function bulkActionComments(request: BulkActionRequest): Promise<BulkActionResponse> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate a successful bulk action
    return mockApiResponse<BulkActionResponse>({
      success: true,
      updated: request.commentIds.length,
    });
  }

  return retryApiCall(async () => {
    const response = await fetch(`${API_BASE_URL}/comments/bulk-action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return handleApiResponse<BulkActionResponse>(response);
  });
}

/**
 * Fetch comment metrics
 */
export async function fetchCommentMetrics(): Promise<CommentMetrics> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Count by platform
    const platformBreakdown: Record<CommentPlatform, number> = {
      youtube: mockCommentData.filter((c) => c.platform === "youtube").length,
      instagram: mockCommentData.filter((c) => c.platform === "instagram").length,
      twitter: mockCommentData.filter((c) => c.platform === "twitter").length,
    };

    return mockApiResponse<CommentMetrics>({
      total: mockCommentData.length,
      unread: mockCommentData.filter((c) => !c.read).length,
      flagged: mockCommentData.filter((c) => c.flagged).length,
      platformBreakdown,
    });
  }

  return retryApiCall(async () => {
    const response = await fetch(`${API_BASE_URL}/comments/metrics`);
    return handleApiResponse<CommentMetrics>(response);
  });
}
