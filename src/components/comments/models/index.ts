import { z } from "zod";

// Comment data models with Zod schema validation
export const CommentSchema: z.ZodType<any> = z.object({
  commentId: z.string(),
  postId: z.string(),
  content: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
    isVerified: z.boolean().optional(),
  }),
  platform: z.string(),
  timestamp: z.string(),
  likes: z.number().default(0),
  replies: z.number().default(0),
  sentiment: z.enum(["positive", "negative", "neutral"]).optional(),
  emotions: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  isRead: z.boolean().default(false),
  isFlagged: z.boolean().default(false),
  parentId: z.string().optional(),
  children: z.array(z.lazy((): z.ZodType<any> => CommentSchema)).optional(),
});

export type Comment = z.infer<typeof CommentSchema>;

export const PostSchema = z.object({
  postId: z.string(),
  title: z.string(),
  content: z.string(),
  platform: z.string(),
  timestamp: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
  }),
  likes: z.number().default(0),
  comments: z.number().default(0),
  shares: z.number().default(0),
  thumbnailUrl: z.string().optional(),
  url: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export const CommentFilterSchema = z.object({
  platform: z.array(z.string()).optional(),
  timeRange: z.string().optional(),
  read: z.boolean().optional(),
  flagged: z.boolean().optional(),
  sentiment: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export type CommentFilter = z.infer<typeof CommentFilterSchema>;

export const CommentMetricsSchema = z.object({
  total: z.number(),
  unread: z.number(),
  flagged: z.number(),
  platforms: z.record(z.string(), z.number()),
  sentiments: z.record(z.string(), z.number()),
  emotions: z.record(z.string(), z.number()),
  categories: z.record(z.string(), z.number()),
});

export type CommentMetrics = z.infer<typeof CommentMetricsSchema>;

export interface CommentMetrics {
  total: number;
  unread: number;
  flagged: number;
  archived: number;
  emotions: Record<string, number>;
  sentiments: Record<string, number>;
  categories: Record<string, number>;
}

export interface CommentFilters {
  emotions?: string[];
  sentiments?: string[];
  categories?: string[];
  status?: string[];
  platforms?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

// Data transformation functions
export function transformCommentsResponse(data: unknown): Comment[] {
  try {
    return z.array(CommentSchema).parse(data);
  } catch (error) {
    console.error("Error validating comments data:", error);
    return [];
  }
}

export function transformPostResponse(data: unknown): Post | null {
  try {
    return PostSchema.parse(data);
  } catch (error) {
    console.error("Error validating post data:", error);
    return null;
  }
}

// Comment thread utilities
export function buildCommentThreads(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.commentId, { ...comment, children: [] });
  });

  // Second pass: build thread structure
  comments.forEach((comment) => {
    const mappedComment = commentMap.get(comment.commentId)!;

    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(mappedComment);
    } else {
      rootComments.push(mappedComment);
    }
  });

  return rootComments;
}
