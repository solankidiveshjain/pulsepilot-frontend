import { Comment, CommentFilters, CommentListResponse } from "@/lib/types/comments";

interface CommentApiResponse {
  id: string;
  postId: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  platform: Comment["platform"];
  sentiment: Comment["sentiment"];
  status: Comment["status"];
  metrics: {
    likes: number;
    replies: number;
    views?: number;
  };
  createdAt: string;
}

export class CommentModel {
  static transformApiResponse(data: CommentApiResponse): Comment {
    return {
      id: data.id,
      postId: data.postId,
      content: data.content,
      author: {
        name: data.author.name,
        avatar: data.author.avatar,
      },
      platform: data.platform,
      sentiment: data.sentiment,
      status: data.status,
      metrics: {
        likes: data.metrics.likes,
        replies: data.metrics.replies,
        views: data.metrics.views,
      },
      createdAt: data.createdAt,
    };
  }

  static filterComments(comments: Comment[], filters: CommentFilters): Comment[] {
    return comments.filter((comment) => {
      if (filters.platform !== "all" && comment.platform !== filters.platform) {
        return false;
      }
      if (filters.sentiment !== "all" && comment.sentiment !== filters.sentiment) {
        return false;
      }
      if (filters.status !== "all" && comment.status !== filters.status) {
        return false;
      }
      if (filters.search && !comment.content.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  static paginateComments(
    comments: Comment[],
    page: number,
    pageSize: number
  ): CommentListResponse {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedComments = comments.slice(start, end);

    return {
      comments: paginatedComments,
      total: comments.length,
      page,
      pageSize,
    };
  }

  static sortComments(
    comments: Comment[],
    sortBy: keyof Comment,
    direction: "asc" | "desc" = "desc"
  ): Comment[] {
    return [...comments].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }
}
