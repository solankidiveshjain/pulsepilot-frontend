import { Comment } from "@/lib/types/comments";
import { Platform } from "@/lib/types/posts";

interface RawComment {
  comment_id: string;
  post_id: string;
  user_id: string;
  platform: Platform;
  content: string;
  author_name: string;
  author_username: string;
  author_avatar_url: string;
  created_at: string;
  updated_at: string;
  sentiment: "positive" | "neutral" | "negative";
  is_flagged: boolean;
  is_archived: boolean;
  is_read: boolean;
  likes_count: number;
  is_liked: boolean;
  platform_specific: {
    youtube?: {
      reply_count: number;
      is_verified: boolean;
    };
    instagram?: {
      reply_count: number;
      is_verified: boolean;
    };
    playstore?: {
      rating: number;
      is_verified: boolean;
    };
  };
}

export function transformComment(raw: RawComment): Comment {
  return {
    comment_id: raw.comment_id,
    post_id: raw.post_id,
    user_id: raw.user_id,
    platform: raw.platform,
    content: raw.content,
    author: {
      name: raw.author_name,
      username: raw.author_username,
      avatar_url: raw.author_avatar_url,
    },
    created_at: new Date(raw.created_at),
    updated_at: new Date(raw.updated_at),
    sentiment: raw.sentiment,
    is_flagged: raw.is_flagged,
    is_archived: raw.is_archived,
    is_read: raw.is_read,
    likes_count: raw.likes_count,
    is_liked: raw.is_liked,
    platform_specific: raw.platform_specific,
  };
}

export function transformComments(raw: RawComment[]): Comment[] {
  return raw.map(transformComment);
}

export function getPlatformSpecificMetrics(comment: Comment) {
  switch (comment.platform) {
    case "youtube":
      return {
        reply_count: comment.platform_specific.youtube?.reply_count ?? 0,
        is_verified: comment.platform_specific.youtube?.is_verified ?? false,
      };
    case "instagram":
      return {
        reply_count: comment.platform_specific.instagram?.reply_count ?? 0,
        is_verified: comment.platform_specific.instagram?.is_verified ?? false,
      };
    case "playstore":
      return {
        rating: comment.platform_specific.playstore?.rating ?? 0,
        is_verified: comment.platform_specific.playstore?.is_verified ?? false,
      };
    default:
      return {};
  }
}
