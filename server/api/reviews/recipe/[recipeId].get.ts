import { count, desc, eq } from "drizzle-orm";
import { recipes, reviews } from "hub:db:schema";
import { formatReviewResponse } from "~~/server/utils/review";
import type { ReviewResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<ReviewResponse[]>> => {
  await requireUserSession(event);

  const recipeId = getRouterParam(event, "recipeId");
  if (!recipeId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const [recipe] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(eq(recipes.id, recipeId))
    .limit(1);
  if (!recipe) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(reviews)
      .where(eq(reviews.recipeId, recipeId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(reviews).where(eq(reviews.recipeId, recipeId)),
  ]);

  return createResponse(
    { code: ApiResponseCode.Success },
    rows.map((row) => formatReviewResponse(row)),
    { total: Number(totalRow[0]?.value ?? 0), limit, offset },
  );
});
