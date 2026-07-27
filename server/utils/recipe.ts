import { inArray } from "drizzle-orm";
import { recipeLikes, recipes } from "hub:db:schema";
import type { RecipeResponse } from "~~/server/types";

export type RecipeRow = typeof recipes.$inferSelect;
export type RecipeLikesAgg = { count: number; userIds: string[] };

const emptyLikes: RecipeLikesAgg = { count: 0, userIds: [] };

/**
 * Aggregate likes for a batch of recipe ids. Returns a map so callers can
 * look up the count + liker list per id; ids with no likes still resolve to
 * `{ count: 0, userIds: [] }` so the formatter doesn't need a fallback.
 */
export async function aggregateLikesForRecipes(
  recipeIds: string[],
): Promise<Map<string, RecipeLikesAgg>> {
  const map = new Map<string, RecipeLikesAgg>();
  if (recipeIds.length === 0) return map;
  for (const id of recipeIds) map.set(id, { count: 0, userIds: [] });

  const rows = await db
    .select({ recipeId: recipeLikes.recipeId, userId: recipeLikes.userId })
    .from(recipeLikes)
    .where(inArray(recipeLikes.recipeId, recipeIds));

  for (const row of rows) {
    const entry = map.get(row.recipeId);
    if (entry) {
      entry.count += 1;
      entry.userIds.push(row.userId);
    }
  }
  return map;
}

/**
 * Shape a raw Drizzle row into the API contract — converting nullables to
 * undefined, formatting timestamps as ISO strings, and overlaying the
 * pre-computed likes aggregation. Single-recipe endpoints pass a real
 * aggregation; list endpoints pass the per-id entry from
 * aggregateLikesForRecipes().
 */
export function formatRecipeResponse(
  row: RecipeRow,
  likes: RecipeLikesAgg = emptyLikes,
): RecipeResponse {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    ingredients: row.ingredients,
    steps: row.steps,
    author: row.author,
    authorName: row.authorName,
    authorAvatar: row.authorAvatar ?? undefined,
    authorBio: row.authorBio ?? undefined,
    tags: row.tags,
    image: row.image,
    cookTime: row.cookTime,
    likes: likes.count,
    likedUserIds: likes.userIds,
    views: row.views,
    difficulty: row.difficulty,
    status: row.status,
    category: row.category,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
