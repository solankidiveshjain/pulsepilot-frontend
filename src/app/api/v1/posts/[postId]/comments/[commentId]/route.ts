import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for updating a comment
const UpdateCommentSchema = z.object({
  needs_attention: z.boolean().optional(),
  is_read: z.boolean().optional(),
  is_flagged: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdateCommentSchema.parse(body);

    const [updatedComment] = await db
      .update(comments)
      .set({
        ...validatedData,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(comments.comment_id, params.commentId),
          eq(comments.platform_post_id, params.postId),
          eq(comments.user_id, session.user.id)
        )
      )
      .returning();

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(updatedComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating comment:", error);
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

    const [deletedComment] = await db
      .delete(comments)
      .where(
        and(
          eq(comments.comment_id, params.commentId),
          eq(comments.platform_post_id, params.postId),
          eq(comments.user_id, session.user.id)
        )
      )
      .returning();

    if (!deletedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
