import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [updatedComment] = await db
      .update(comments)
      .set({
        likes: comments.likes + 1,
        updated_at: new Date(),
      })
      .where(
        and(eq(comments.comment_id, params.commentId), eq(comments.platform_post_id, params.postId))
      )
      .returning();

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [updatedComment] = await db
      .update(comments)
      .set({
        likes: comments.likes - 1,
        updated_at: new Date(),
      })
      .where(
        and(eq(comments.comment_id, params.commentId), eq(comments.platform_post_id, params.postId))
      )
      .returning();

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error unliking comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
