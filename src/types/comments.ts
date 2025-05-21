export type Platform = "twitter" | "facebook" | "instagram" | "linkedin" | "youtube";

export type Emotion = "happy" | "sad" | "angry" | "neutral" | "excited";

export type Sentiment = "positive" | "negative" | "neutral";

export type CommentStatus = "new" | "in-progress" | "resolved" | "archived";

export type CommentCategory = "feedback" | "question" | "complaint" | "suggestion" | "other";

export interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    username: string;
  };
  platform: Platform;
  postId: string;
  createdAt: string;
  updatedAt: string;
  emotion: Emotion;
  sentiment: Sentiment;
  status: CommentStatus;
  category: CommentCategory;
  metadata: {
    likes: number;
    replies: number;
    shares: number;
    isVerified?: boolean;
    isPinned?: boolean;
    isEdited?: boolean;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  author: {
    id: string;
    name: string;
    avatar?: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  metadata: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface CommentFilters {
  search: string;
  status: CommentStatus | "all";
  platforms: Platform[];
  emotions: Emotion[];
  sentiments: Sentiment[];
  categories: CommentCategory[];
  dateRange?: {
    start: string;
    end: string;
  };
}
