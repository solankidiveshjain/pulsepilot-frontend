"use client";

import { Comment, CommentListResponse } from "@/lib/types/comments";

interface GetCommentsParams {
  postId: string;
  page: number;
  pageSize: number;
}

interface UpdateCommentParams {
  commentId: string;
  updates: Partial<Comment>;
}

class CommentsApi {
  private baseUrl = "/api/v1/comments";

  async getComments({ postId, page, pageSize }: GetCommentsParams): Promise<CommentListResponse> {
    const response = await fetch(
      `${this.baseUrl}?postId=${postId}&page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    return response.json();
  }

  async updateCommentStatus({ commentId, updates }: UpdateCommentParams): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update comment");
    }
  }

  async likeComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}/like`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to like comment");
    }
  }

  async unlikeComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}/unlike`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed to unlike comment");
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${commentId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
  }
}

export const commentsApi = new CommentsApi();
