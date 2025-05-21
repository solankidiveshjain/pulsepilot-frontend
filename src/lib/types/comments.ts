export type CommentPlatform = "youtube" | "instagram" | "playstore";

export type MediaType = "image" | "video" | "text";
export type PostType = "post" | "reel" | "story" | "video";

export interface Author {
  name: string;
  avatar_url: string;
  platform_username: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  platform: "youtube" | "instagram" | "playstore";
  sentiment: "positive" | "neutral" | "negative";
  status: "needs_attention" | "read" | "flagged" | "archived";
  metrics: {
    likes: number;
    replies: number;
    views?: number;
  };
  createdAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor: string | null;
}

export interface PostPreview {
  postId: string;
  title: string;
  caption: string;
  thumbnailUrl: string | null;
  platform: CommentPlatform;
  mediaType: MediaType;
  postType: PostType;
}

export interface Reply {
  replyId: string;
  text: string;
  postedAt: string;
  author: Author;
}

export interface CommentThread {
  commentId: string;
  totalReplies: number;
  replies: Reply[];
}

export interface CommentMetrics {
  total: number;
  flagged: number;
  unread: number;
  platformBreakdown: Record<CommentPlatform, number>;
}

export type BulkAction = "mark_read" | "mark_unread" | "flag" | "unflag" | "archive" | "unarchive";

export interface BulkActionRequest {
  commentIds: string[];
  action: BulkAction;
}

export interface BulkActionResponse {
  success: boolean;
  updated: number;
}

export type Platform = "youtube" | "instagram" | "playstore";
export type Sentiment = "positive" | "neutral" | "negative";
export type Status = "all" | "needs_attention" | "read" | "flagged" | "archived";

export interface CommentFilters {
  search: string;
  platform: "all" | "youtube" | "instagram" | "playstore";
  sentiment: "all" | "positive" | "neutral" | "negative";
  status: "all" | "needs_attention" | "read" | "flagged" | "archived";
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UseCommentsOptions {
  postId: string;
  filters?: CommentFilters;
  page?: number;
  pageSize?: number;
}
