import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { account, session, user } from "#auth/schema";

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const recipes = pgTable(
  "recipes",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    ingredients: jsonb("ingredients").$type<{ name: string; quantity: string }[]>().notNull(),
    steps: text("steps").array().notNull(),
    author: text("author")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    authorAvatar: text("author_avatar"),
    authorBio: text("author_bio"),
    tags: text("tags").array().notNull().default([]),
    image: text("image").notNull(),
    cookTime: integer("cook_time").notNull(),
    views: integer("views").notNull().default(0),
    difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("pending"),
    category: text("category")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("recipes_author_idx").on(t.author),
    index("recipes_category_idx").on(t.category),
    index("recipes_status_idx").on(t.status),
    index("recipes_title_trgm_idx").using("gin", sql`title gin_trgm_ops`),
    index("recipes_description_trgm_idx").using("gin", sql`description gin_trgm_ops`),
  ],
);

export const recipeLikes = pgTable(
  "recipe_likes",
  {
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.recipeId, t.userId] }),
    index("recipe_likes_recipe_idx").on(t.recipeId),
    index("recipe_likes_user_idx").on(t.userId),
  ],
);

export const recipeViews = pgTable(
  "recipe_views",
  {
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.recipeId, t.userId] }),
    index("recipe_views_recipe_idx").on(t.recipeId),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    userName: text("user_name").notNull(),
    userAvatar: text("user_avatar"),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("reviews_recipe_idx").on(t.recipeId), index("reviews_user_idx").on(t.userId)],
);

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.recipeId] }),
    index("favorites_user_idx").on(t.userId),
    index("favorites_recipe_idx").on(t.recipeId),
  ],
);

export const follows = pgTable(
  "follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    index("follows_follower_idx").on(t.followerId),
    index("follows_following_idx").on(t.followingId),
  ],
);

export const mealPlans = pgTable(
  "meal_plans",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    recipes: jsonb("recipes")
      .$type<{ recipeId: string; day: string; mealType: string }[]>()
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("meal_plans_user_idx").on(t.userId)],
);

export const shoppingLists = pgTable("shopping_lists", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  items: jsonb("items").$type<{ name: string; quantity: string; checked: boolean }[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Inferred row types for internal server use (queries, transforms).
export type CategoryRow = typeof categories.$inferSelect;
export type RecipeRow = typeof recipes.$inferSelect;
export type RecipeLikeRow = typeof recipeLikes.$inferSelect;
export type RecipeViewRow = typeof recipeViews.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type FavoriteRow = typeof favorites.$inferSelect;
export type FollowRow = typeof follows.$inferSelect;
export type MealPlanRow = typeof mealPlans.$inferSelect;
export type ShoppingListRow = typeof shoppingLists.$inferSelect;

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  recipes: many(recipes),
  reviews: many(reviews),
}));

export const recipeRelations = relations(recipes, ({ many, one }) => ({
  author: one(user, { fields: [recipes.author], references: [user.id] }),
  likes: many(recipeLikes),
  reviews: many(reviews),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  recipe: one(recipes, { fields: [reviews.recipeId], references: [recipes.id] }),
  user: one(user, { fields: [reviews.userId], references: [user.id] }),
}));
