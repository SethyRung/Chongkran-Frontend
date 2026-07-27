import { count, desc, eq, inArray } from "drizzle-orm";
import { favorites, recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse[]>> => {
  const { user: sessionUser } = await requireUserSession(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const [favRows, totalRow] = await Promise.all([
    db
      .select({ recipeId: favorites.recipeId })
      .from(favorites)
      .where(eq(favorites.userId, sessionUser.id))
      .orderBy(desc(favorites.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(favorites).where(eq(favorites.userId, sessionUser.id)),
  ]);

  const recipeIds = favRows.map((row) => row.recipeId);
  if (recipeIds.length === 0) {
    return createResponse({ code: ApiResponseCode.Success }, [], {
      total: Number(totalRow[0]?.value ?? 0),
      limit,
      offset,
    });
  }

  const recipeRows = await db.select().from(recipes).where(inArray(recipes.id, recipeIds));
  const likesMap = await aggregateLikesForRecipes(recipeIds);

  const recipesById = new Map(recipeRows.map((row) => [row.id, row]));
  const ordered: RecipeResponse[] = recipeIds
    .map((id) => recipesById.get(id))
    .filter((row): row is NonNullable<typeof row> => row !== undefined)
    .map((row) => formatRecipeResponse(row, likesMap.get(row.id)));

  return createResponse({ code: ApiResponseCode.Success }, ordered, {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
