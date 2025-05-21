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

// Generate more realistic comment text with varied content
const COMMENT_TEXTS = [
  "This content is amazing! I've been following your work for years and it keeps getting better.",
  "I disagree with some of your points. Have you considered the alternative perspective?",
  "Could you please explain the third point in more detail? I'm not sure I understand completely.",
  "First! Been waiting for this new post all week!",
  "This helped me solve a problem I've been stuck on for weeks. Thank you!",
  "Your insights have really helped me improve my own strategy. Keep up the great work!",
  "I shared this with my team and we've implemented your suggestions with great results.",
  "The quality of your content has dropped recently. I hope you get back to your usual standards soon.",
  "This is exactly what I needed right now. Perfect timing!",
  "I have a question about implementing this in a different context. Would it still work?",
  "Your perspectives are always refreshing and make me think outside the box.",
  "Not your best work. I expected more depth on this topic.",
  "I've been implementing these techniques for months and they've transformed my business.",
  "Would love to see a follow-up piece that goes deeper on point #2.",
  "This contradicts what you said in your previous post. Has your position changed?",
  "This content is so inspirational! Just what I needed today.",
  "I've noticed similar trends in my industry. Great analysis!",
  "Can you recommend any resources to learn more about this topic?",
  "I think you missed an important factor in your analysis - market conditions are changing rapidly.",
  "Using these techniques increased my engagement by 40% in just two weeks.",
];

// Generate a wider range of realistic user names
const AUTHOR_NAMES = [
  "Sarah Johnson",
  "David Chen",
  "Emma Williams",
  "Alex Thompson",
  "Michael Rodriguez",
  "Priya Patel",
  "James Wilson",
  "Zoe Garcia",
  "Hiroshi Nakamura",
  "Olivia Brown",
  "Carlos Mendez",
  "Fatima Al-Farsi",
  "Robert Kim",
  "Ana Silva",
  "John Okafor",
  "Wei Zhang",
  "Sophia Martinez",
  "Raj Patel",
  "Isabella Romano",
  "Mohammed Hassan",
];

// Create more varied post titles
const POST_TITLES = [
  "10 Essential Strategies for Social Media Growth in 2025",
  "Why Content Quality Matters More Than Ever",
  "The Future of Digital Marketing: Trends to Watch",
  "How to Increase Your Engagement Rates by 300%",
  "Building a Loyal Community: Beyond the Numbers",
  "Authenticity vs. Polish: Finding the Right Balance",
  "Data-Driven Content Creation: A Step-by-Step Guide",
  "The Psychology Behind Viral Content",
  "Cross-Platform Strategy: Maintaining a Consistent Brand Voice",
  "How We Gained 100K Followers in 3 Months",
];

// Create a larger pool of posts with more details
const POSTS = POST_TITLES.map((title, index) => ({
  id: `post-${index + 1}`,
  title,
  platform: ["youtube", "instagram", "twitter"][Math.floor(Math.random() * 3)] as CommentPlatform,
  publishedAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(), // Random date in last 30 days
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  imageUrl: `https://picsum.photos/seed/${index + 1}/600/400`,
  engagement: {
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 1000),
    shares: Math.floor(Math.random() * 500),
  },
}));

// Generate a realistic set of comments with diverse attributes
export function generateComments(count: number): Comment[] {
  const comments: Comment[] = [];

  for (let i = 0; i < count; i++) {
    const postIndex = Math.floor(Math.random() * POSTS.length);
    const postId = POSTS[postIndex].id;
    const platform = POSTS[postIndex].platform;

    // Random timestamp within the last 30 days
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));

    // Varied engagement metrics
    const likes = Math.floor(Math.random() * 150);
    const repliesCount = Math.floor(Math.random() * 20);

    // Varied status flags with realistic distribution
    const status =
      Math.random() < 0.15
        ? "flagged"
        : Math.random() < 0.6
          ? "read"
          : Math.random() < 0.2
            ? "needs_attention"
            : "archived";

    // Create the comment
    const comment: Comment = {
      id: `comment-${Date.now()}-${i}`,
      postId,
      content: COMMENT_TEXTS[Math.floor(Math.random() * COMMENT_TEXTS.length)],
      author: {
        name: AUTHOR_NAMES[Math.floor(Math.random() * AUTHOR_NAMES.length)],
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.7 ? "women" : "men"}/${Math.floor(Math.random() * 70)}.jpg`,
      },
      platform,
      sentiment: Math.random() < 0.6 ? "positive" : Math.random() < 0.8 ? "neutral" : "negative",
      status,
      metrics: {
        likes,
        replies: repliesCount,
      },
      createdAt: timestamp.toISOString(),
    };

    comments.push(comment);
  }

  return comments;
}

// Mock API endpoint for fetching comments
export const fetchComments = async ({
  page = 1,
  filters = {},
}: { page?: number; filters?: Record<string, string[]> } = {}) => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());

  // Add filters to query params
  Object.entries(filters).forEach(([key, values]) => {
    values.forEach((value) => queryParams.append(key, value));
  });

  const response = await fetch(`/api/comments?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

// Function to get full post details by ID
export async function fetchPostById(postId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

  const post = POSTS.find((p) => p.id === postId);

  if (!post) {
    throw new Error(`Post not found: ${postId}`);
  }

  // Add more detailed data for the full post view
  return {
    ...post,
    commentCount: Math.floor(Math.random() * 1000),
    viewCount: Math.floor(Math.random() * 100000),
    replyCount: Math.floor(Math.random() * 200),
    postUrl: `https://example.com/posts/${postId}`,
    // Add some related comments to the post
    comments: generateComments(5).map((comment) => ({
      ...comment,
      postId: post.id,
    })),
  };
}

// Function to perform bulk actions on comments
export async function performBulkAction(
  action: "mark_read" | "flag" | "unflag" | "archive" | "unarchive",
  commentIds: string[]
): Promise<{ success: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  console.log(`Performed ${action} on comments:`, commentIds);

  // In a real app, this would update the database
  return { success: true };
}

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
    if (filters.platform !== "all") {
      queryParams["platform"] = filters.platform;
    }

    if (filters.sentiment !== "all") {
      queryParams["sentiment"] = filters.sentiment;
    }

    if (filters.status !== "all") {
      queryParams["status"] = filters.status;
    }

    if (filters.search) {
      queryParams["search"] = filters.search;
    }
  }

  const queryString = createQueryString(queryParams);

  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Apply filters
    let filteredComments = [...mockCommentData];

    if (filters) {
      if (filters.platform !== "all") {
        filteredComments = filteredComments.filter((c) => c.platform === filters.platform);
      }

      if (filters.sentiment !== "all") {
        filteredComments = filteredComments.filter((c) => c.sentiment === filters.sentiment);
      }

      if (filters.status !== "all") {
        filteredComments = filteredComments.filter((c) => c.status === filters.status);
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
      nextCursor:
        hasNextPage && paginatedComments.length > 0
          ? paginatedComments[paginatedComments.length - 1].id
          : null,
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
