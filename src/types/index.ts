/**
 * Core type definitions for the PulsePilot application
 */

// Platform types
export type Platform = "youtube" | "instagram" | "twitter" | "tiktok" | "facebook" | "linkedin"

// Emotion types
export type Emotion = "excited" | "angry" | "curious" | "happy" | "sad" | "neutral"

// Sentiment types
export type Sentiment = "positive" | "negative" | "neutral"

// Category types
export type Category = "product" | "vip" | "spam" | "general"

// Status types
export type Status = "all" | "flagged" | "attention" | "archived"

// Author interface
export interface Author {
  name: string
  avatar: string
  isOwner?: boolean
}

// Comment interface
export interface Comment {
  id: string
  author: Author
  text: string
  platform: Platform
  time: string
  timeTooltip?: string
  likes: number
  replies: number
  flagged: boolean
  needsAttention: boolean
  archived: boolean
  postId: string
  postTitle: string
  postThumbnail: string
  emotion: Emotion
  sentiment: Sentiment
  category: Category
  isAiGenerated?: boolean
}

// Comment Reply interface
export interface CommentReply {
  id: string
  author: Author
  text: string
  time: string
  timeTooltip: string
  likes: number
  isAiGenerated?: boolean
}

// Post interface
export interface Post {
  id: string
  title: string
  thumbnail: string
  platform: string
  date: string
  caption: string
  likes: number
  comments: number
  views: string
  url: string
}

// Filter state interface
export interface FilterState {
  search: string
  status: Status
  platforms: Platform[]
  emotions: Emotion[]
  sentiments: Sentiment[]
  categories: Category[]
}

// Sort option interface
export interface SortOption {
  id: string
  label: string
  icon: string
}

// Platform info interface
export interface PlatformInfo {
  id: Platform
  label: string
  color: string
  icon: string
  count: number
}

// Emotion info interface
export interface EmotionInfo {
  id: Emotion
  label: string
  icon: string
  color: string
  count: number
}

// Sentiment info interface
export interface SentimentInfo {
  id: Sentiment
  label: string
  icon: string
  color: string
  count: number
}

// Category info interface
export interface CategoryInfo {
  id: Category
  label: string
  icon: string
  color: string
  count: number
}

// Status info interface
export interface StatusInfo {
  id: Status
  label: string
  icon: string
  count: number
}

// Active filter interface
export interface ActiveFilter {
  type: "status" | "platforms" | "emotions" | "sentiments" | "categories"
  id: string
  label: string
  icon?: string
}

// Pagination interface for API responses
export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

// Post preview types
export interface TextPreview {
  type: 'text'
  content: string
}

export interface ImagePreview {
  type: 'image'
  url: string
  width: number
  height: number
  thumbnailUrl: string
}

export interface VideoPreview {
  type: 'video'
  url: string
  duration: number
  thumbnailUrl: string
}

// Union of all preview types
export type PostPreview = TextPreview | ImagePreview | VideoPreview

// Profile interface for user and team settings
export interface Profile {
  id: string
  teamId: string
  userName: string
  email: string
  avatarUrl: string
  roles: string[]
  settings: Record<string, unknown>
}

// Social connection types
export interface ConnectionRequest {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface Connection {
  id: string
  platform: string
  status: 'connected' | 'disconnected'
  createdAt: string
  metadata: Record<string, unknown>
}
