import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const websitesTable = sqliteTable("websites", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title"),
  link: text("link"),
  description: text("description").default(""),
  user_id: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const shopCategoriesTable = sqliteTable("shop_categories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  tag: text("tag").notNull().unique(),
});

export const shopSubcategoriesTable = sqliteTable("shop_subcategories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category_id: integer("category_id")
    .notNull()
    .references(() => shopCategoriesTable.id, { onDelete: "cascade" }),
});

export const shopItemsTable = sqliteTable("shop_items", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  link: text("link").notNull(),
  description: text("description").default(""),
  category_id: integer("category_id")
    .notNull()
    .references(() => shopCategoriesTable.id, { onDelete: "cascade" }),
  subcategory_id: integer("subcategory_id")
    .references(() => shopSubcategoriesTable.id, { onDelete: "set null" }),
});
