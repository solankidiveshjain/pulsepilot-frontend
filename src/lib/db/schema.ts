import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  comment_id: uuid("comment_id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.user_id),
  platform: text("platform", { enum: ["youtube", "instagram", "playstore"] }).notNull(),
  platform_comment_id: text("platform_comment_id").notNull(),
  platform_post_id: text("platform_post_id").notNull(),
  author_name: text("author_name").notNull(),
  author_avatar_url: text("author_avatar_url").notNull(),
  author_platform_username: text("author_platform_username").notNull(),
  content: text("content").notNull(),
  sentiment: text("sentiment", { enum: ["positive", "neutral", "negative"] }).nullable(),
  needs_attention: boolean("needs_attention").notNull().default(false),
  is_read: boolean("is_read").notNull().default(false),
  is_flagged: boolean("is_flagged").notNull().default(false),
  is_archived: boolean("is_archived").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  likes: integer("likes").notNull().default(0),
  engagement: jsonb("engagement")
    .$type<{
      likes: number;
      replies: number;
      youtube?: {
        is_author: boolean;
        is_pinned: boolean;
      };
      instagram?: {
        is_verified: boolean;
        is_highlighted: boolean;
      };
      playstore?: {
        is_developer: boolean;
        rating: number;
      };
    }>()
    .notNull()
    .default({ likes: 0, replies: 0 }),
});

// Add relations
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.user_id],
    references: [users.user_id],
  }),
}));

// Add indexes
export const commentsIndexes = {
  idx_comments_user: "idx_comments_user",
  idx_comments_platform: "idx_comments_platform",
  idx_comments_created: "idx_comments_created",
  idx_comments_sentiment: "idx_comments_sentiment",
  idx_comments_needs_attention: "idx_comments_needs_attention",
  idx_comments_is_read: "idx_comments_is_read",
  idx_comments_is_flagged: "idx_comments_is_flagged",
  idx_comments_is_archived: "idx_comments_is_archived",
};
