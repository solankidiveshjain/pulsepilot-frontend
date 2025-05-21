import { mockCommentService } from "@/lib/mocks/comments";
import { CommentFilters, Platform, Sentiment, Status } from "@/lib/types/comments";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: CommentFilters = {
      search: searchParams.get("search") || "",
      platform: (searchParams.get("platform") as Platform) || "all",
      sentiment: (searchParams.get("sentiment") as Sentiment) || "all",
      status: (searchParams.get("status") as Status) || "all",
    };

    const result = await mockCommentService.getComments(params.postId, filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
