import { Comment, CommentFilters, CommentsResponse } from "@/lib/types/comments";

const mockComments: Comment[] = [
  {
    id: "1",
    postId: "post1",
    content: "Great video! Really enjoyed the content.",
    author: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    platform: "youtube",
    sentiment: "positive",
    status: "read",
    metrics: {
      likes: 10,
      replies: 2,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    postId: "post1",
    content: "This is amazing! 🔥",
    author: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    platform: "instagram",
    sentiment: "positive",
    status: "needs_attention",
    metrics: {
      likes: 25,
      replies: 5,
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    postId: "post1",
    content: "The app keeps crashing on startup.",
    author: {
      name: "Bob Wilson",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    platform: "playstore",
    sentiment: "negative",
    status: "flagged",
    metrics: {
      likes: 5,
      replies: 1,
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const mockCommentService = {
  async getComments(postId: string, filters: CommentFilters): Promise<CommentsResponse> {
    let filteredComments = [...mockComments];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredComments = filteredComments.filter(
        (comment) =>
          comment.content.toLowerCase().includes(searchLower) ||
          comment.author.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.platform !== "all") {
      filteredComments = filteredComments.filter(
        (comment) => comment.platform === filters.platform
      );
    }

    if (filters.sentiment !== "all") {
      filteredComments = filteredComments.filter(
        (comment) => comment.sentiment === filters.sentiment
      );
    }

    if (filters.status !== "all") {
      filteredComments = filteredComments.filter((comment) => comment.status === filters.status);
    }

    // Apply pagination
    const pageSize = 20;
    const page = 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedComments = filteredComments.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < filteredComments.length;

    return {
      comments: paginatedComments,
      nextCursor:
        hasMore && paginatedComments.length > 0
          ? paginatedComments[paginatedComments.length - 1].id
          : null,
    };
  },

  async likeComment(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  async unlikeComment(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  async updateCommentStatus(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  async deleteComment(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};
