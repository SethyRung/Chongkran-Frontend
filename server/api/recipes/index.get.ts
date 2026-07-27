import { count, desc, ilike, or } from "drizzle-orm";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse[]>> => {
  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);
  const search = typeof query.search === "string" ? query.search.trim() : "";

  const where = search
    ? or(ilike(recipes.title, `%${search}%`), ilike(recipes.description, `%${search}%`))
    : undefined;

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
