import { Comment, CommentListResponse } from "@/lib/types/comments";
import { NextRequest } from "next/server";

// Simple mock data for three platforms
const MOCK_COMMENTS: Record<string, Comment[]> = {
  "youtube-post-1": [
    {
      id: "yt-1",
      postId: "youtube-post-1",
      content: "Great video! Learned a lot.",
      author: { name: "Alice", avatar: "/avatars/alice.png" },
      platform: "youtube",
      sentiment: "positive",
      status: "read",
      metrics: { likes: 12, replies: 2, views: 100 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "yt-2",
      postId: "youtube-post-1",
      content: "Can you make a follow-up?",
      author: { name: "Bob", avatar: "/avatars/bob.png" },
      platform: "youtube",
      sentiment: "neutral",
      status: "needs_attention",
      metrics: { likes: 3, replies: 0, views: 50 },
      createdAt: new Date().toISOString(),
    },
  ],
  "instagram-post-1": [
    {
      id: "ig-1",
      postId: "instagram-post-1",
      content: "Love this post!",
      author: { name: "Carol", avatar: "/avatars/carol.png" },
      platform: "instagram",
      sentiment: "positive",
      status: "read",
      metrics: { likes: 20, replies: 1, views: 80 },
      createdAt: new Date().toISOString(),
    },
  ],
  "playstore-post-1": [
    {
      id: "ps-1",
      postId: "playstore-post-1",
      content: "App keeps crashing on launch.",
      author: { name: "Dave", avatar: "/avatars/dave.png" },
      platform: "playstore",
      sentiment: "negative",
      status: "flagged",
      metrics: { likes: 0, replies: 0, views: 10 },
      createdAt: new Date().toISOString(),
    },
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  const allComments = MOCK_COMMENTS[postId] || [];
  const pagedComments = allComments.slice((page - 1) * pageSize, page * pageSize);

  const response: CommentListResponse = {
    comments: pagedComments,
    total: allComments.length,
    page,
    pageSize,
  };

  return Response.json(response);
}
