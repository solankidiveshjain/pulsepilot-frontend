import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

// Database schema types
interface Database {
  teams: {
    team_id: string;
    team_name: string;
    plan_id: string;
    created_at: Date;
    settings: Record<string, unknown>;
  };
  recent_posts: {
    post_id: string;
    team_id: string;
    platform: string;
    platform_post_id: string;
    content: Record<string, unknown>;
    created_at: Date;
    expires_at: Date;
  };
  comment_metrics: {
    team_id: string;
    platform: string;
    hour: Date;
    total_comments: number;
    read_comments: number;
    flagged_comments: number;
  };
}

// Create database connection
const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
