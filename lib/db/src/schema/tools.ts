import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const toolsTable = pgTable("tools", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categoriesTable.id),
  pricing: text("pricing", { enum: ["Free", "Freemium", "Paid"] }).notNull(),
  featured: boolean("featured").notNull().default(false),
  rating: doublePrecision("rating").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertToolSchema = createInsertSchema(toolsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof toolsTable.$inferSelect;
