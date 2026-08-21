import { desc, eq, sql } from "drizzle-orm";
import { recipeLikes, recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse[]>> => {
  const limit = clampLimit(getQuery(event).limit, { default: 8, max: 24 });

  const rows = await db
    .select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      ingredients: recipes.ingredients,
      steps: recipes.steps,
      author: recipes.author,
      authorName: recipes.authorName,
      authorAvatar: recipes.authorAvatar,
      authorBio: recipes.authorBio,
      tags: recipes.tags,
      image: recipes.image,
      cookTime: recipes.cookTime,
      views: recipes.views,
      difficulty: recipes.difficulty,
      status: recipes.status,
      category: recipes.category,
      createdAt: recipes.createdAt,
      updatedAt: recipes.updatedAt,
      likes: sql<number>`(SELECT COUNT(*) FROM ${recipeLikes} WHERE ${recipeLikes.recipeId} = ${recipes.id})`,
    })
    .from(recipes)
    .where(eq(recipes.status, "approved"))
    .orderBy(
      desc(recipes.views),
      desc(
        sql`(SELECT COUNT(*) FROM ${recipeLikes} WHERE ${recipeLikes.recipeId} = ${recipes.id})`,
      ),
      desc(recipes.createdAt),
    )
    .limit(limit);

  const likesMap = await aggregateLikesForRecipes(rows.map((r) => r.id));

  return createResponse(
    { code: ApiResponseCode.Success },
    rows.map((row) => {
      const likesFromMap = likesMap.get(row.id) ?? { count: 0, userIds: [] };
      return formatRecipeResponse(row, {
        count: row.likes ?? likesFromMap.count,
        userIds: likesFromMap.userIds,
      });
    }),
    { total: rows.length, limit, offset: 0 },
  );
});
