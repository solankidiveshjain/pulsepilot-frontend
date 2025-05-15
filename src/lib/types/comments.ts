export type CommentPlatform = "youtube" | "instagram" | "twitter";

export type MediaType = "image" | "video" | "text";
export type PostType = "post" | "reel" | "story" | "video";

export interface Author {
  name: string;
  profileImageUrl: string;
  platform?: CommentPlatform;
}

export interface Comment {
  commentId: string;
  text: string;
  postedAt: string;
  likes: number;
  repliesCount: number;
  flagged: boolean;
  requiresAttention: boolean;
  platform: CommentPlatform;
  author: Author;
  postId: string;
  read: boolean;
  archived: boolean;
}

export interface CommentsResponse {
  page: number;
  nextCursor?: string;
  comments: Comment[];
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

export type BulkAction = "mark_read" | "archive" | "unarchive" | "flag" | "unflag";

export interface BulkActionRequest {
  action: BulkAction;
  commentIds: string[];
}

export interface BulkActionResponse {
  success: boolean;
  updated: number;
}

export interface CommentFilters {
  platform?: CommentPlatform[];
  flagged?: boolean;
  unread?: boolean;
  archived?: boolean;
  requiresAttention?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}
