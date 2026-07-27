import { and, count, desc, eq } from "drizzle-orm";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse[]>> => {
  const authorId = getRouterParam(event, "authorId");
  if (!authorId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Author id is required",
    });
  }

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const where = and(eq(recipes.author, authorId), eq(recipes.status, "approved"));

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(recipes)
      .where(where)
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(recipes).where(where),
  ]);

  const likesMap = await aggregateLikesForRecipes(rows.map((r) => r.id));

  return createResponse(
    { code: ApiResponseCode.Success },
    rows.map((row) => formatRecipeResponse(row, likesMap.get(row.id))),
    { total: Number(totalRow[0]?.value ?? 0), limit, offset },
  );
});
