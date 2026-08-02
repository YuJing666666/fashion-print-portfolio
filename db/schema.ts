import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const portfolioSettings = sqliteTable("portfolio_settings", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const portfolioProjects = sqliteTable("portfolio_projects", {
  slug: text("slug").primaryKey(),
  data: text("data").notNull(),
  displayOrder: integer("display_order").notNull(),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  hero: integer("hero", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [index("idx_portfolio_projects_display_order").on(table.displayOrder)]);

export const portfolioAdmins = sqliteTable("portfolio_admins", {
  userId: text("user_id").primaryKey(),
  email: text("email"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
