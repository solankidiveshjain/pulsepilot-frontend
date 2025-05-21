import { Comment, CommentFilters, CommentPlatform } from "@/lib/types/comments";

/**
 * Comment domain model with encapsulated behavior
 */
export class CommentModel {
  private _comment: Comment;

  constructor(comment: Comment) {
    this._comment = comment;
  }

  get id(): string {
    return this._comment.commentId;
  }

  get content(): string {
    return this._comment.text;
  }

  get author(): string {
    return this._comment.author.name;
  }

  get authorImage(): string {
    return this._comment.author.profileImageUrl;
  }

  get platform(): CommentPlatform {
    return this._comment.platform;
  }

  get postedAt(): string {
    return this._comment.postedAt;
  }

  get likesCount(): number {
    return this._comment.likes;
  }

  get repliesCount(): number {
    return this._comment.repliesCount;
  }

  get isRead(): boolean {
    return this._comment.read;
  }

  get isFlagged(): boolean {
    return this._comment.flagged;
  }

  get isArchived(): boolean {
    return this._comment.archived;
  }

  get requiresAttention(): boolean {
    return this._comment.requiresAttention;
  }

  get postId(): string {
    return this._comment.postId;
  }

  get emotions(): string[] {
    return this._comment.emotions || [];
  }

  get sentiment(): string {
    return this._comment.sentiment || "";
  }

  get categories(): string[] {
    return this._comment.categories || [];
  }

  get raw(): Comment {
    return { ...this._comment };
  }

  /**
   * Format relative time for display
   */
  formatRelativeTime(): string {
    const now = new Date();
    const commentDate = new Date(this._comment.postedAt);
    const diffInDays = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  /**
   * Check if this comment matches the given filters
   */
  matchesFilters(filters: CommentFilters): boolean {
    // Platform filter
    if (filters.platform && filters.platform.length > 0) {
      if (!filters.platform.includes(this._comment.platform)) {
        return false;
      }
    }

    // Flagged filter
    if (filters.flagged === true && !this._comment.flagged) {
      return false;
    }

    // Unread filter
    if (filters.unread === true && this._comment.read) {
      return false;
    }

    // Requires attention filter
    if (filters.requiresAttention === true && !this._comment.requiresAttention) {
      return false;
    }

    // Archived filter
    if (filters.archived === true && !this._comment.archived) {
      return false;
    }

    // Search filter
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      if (
        !this._comment.text.toLowerCase().includes(searchTerm) &&
        !this._comment.author.name.toLowerCase().includes(searchTerm)
      ) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
      const commentDate = new Date(this._comment.postedAt).getTime();

      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start).getTime();
        if (commentDate < startDate) {
          return false;
        }
      }

      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end).getTime();
        if (commentDate > endDate) {
          return false;
        }
      }
    }

    // Emotions filter
    if (filters.emotions && filters.emotions.length > 0) {
      // If the comment doesn't have emotions data or none of the filtered emotions match
      if (
        !this._comment.emotions ||
        !this._comment.emotions.some((emotion) => filters.emotions!.includes(emotion))
      ) {
        return false;
      }
    }

    // Sentiment filter
    if (filters.sentiments && filters.sentiments.length > 0) {
      // If the comment doesn't have sentiment data or the sentiment isn't in the filter list
      if (!this._comment.sentiment || !filters.sentiments.includes(this._comment.sentiment)) {
        return false;
      }
    }

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      // If the comment doesn't have categories data or none of the filtered categories match
      if (
        !this._comment.categories ||
        !this._comment.categories.some((category) => filters.categories!.includes(category))
      ) {
        return false;
      }
    }

    return true;
  }
}
