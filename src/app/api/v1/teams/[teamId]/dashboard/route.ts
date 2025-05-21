import { withErrorHandling } from "@/lib/api/error-handling";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async (req: Request, { params }) => {
  const { teamId } = params;

  // Fetch dashboard data in parallel
  const [recentPosts, commentMetrics, teamStats] = await Promise.all([
    db
      .selectFrom("recent_posts")
      .where("team_id", "=", teamId)
      .orderBy("created_at", "desc")
      .limit(5)
      .execute(),

    db
      .selectFrom("comment_metrics")
      .where("team_id", "=", teamId)
      .where("hour", ">=", new Date(Date.now() - 24 * 60 * 60 * 1000))
      .execute(),

    db
      .selectFrom("teams")
      .where("team_id", "=", teamId)
      .select(["team_name", "plan_id", "settings"])
      .executeTakeFirst(),
  ]);

  return NextResponse.json({
    recentPosts,
    commentMetrics,
    teamStats,
    timestamp: new Date().toISOString(),
  });
});
