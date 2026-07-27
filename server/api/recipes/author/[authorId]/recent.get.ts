import { and, desc, eq } from "drizzle-orm";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse[]>> => {
  const authorId = getRouterParam(event, "authorId");
  if (!authorId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Author id is required",
    });
  }

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 5 });

  const where = and(eq(recipes.author, authorId), eq(recipes.status, "approved"));

  const rows = await db
    .select()
    .from(recipes)
    .where(where)
    .orderBy(desc(recipes.createdAt))
    .limit(limit);

  const likesMap = await aggregateLikesForRecipes(rows.map((r) => r.id));

  return createResponse(
    { code: ApiResponseCode.Success },
    rows.map((row) => formatRecipeResponse(row, likesMap.get(row.id))),
  );
});
