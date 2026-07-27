import { and, count, desc, eq } from "drizzle-orm";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse[]>> => {
  const { user } = await requireSession(event);

  const query = getQuery(event);
  const statusParam = typeof query.status === "string" ? query.status : "all";
  const status =
    statusParam === "all" ? undefined : (statusParam as "pending" | "approved" | "rejected");
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const where = status
    ? and(eq(recipes.author, user.id), eq(recipes.status, status))
    : eq(recipes.author, user.id);

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
