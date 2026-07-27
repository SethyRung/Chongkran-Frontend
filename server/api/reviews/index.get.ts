import { and, count, desc, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { recipes, reviews } from "hub:db:schema";
import type { ReviewResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<ReviewResponse[]>> => {
  await requireAdmin(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const ratingMin = typeof query.ratingMin === "string" ? Number(query.ratingMin) : undefined;
  const ratingMax = typeof query.ratingMax === "string" ? Number(query.ratingMax) : undefined;

  const conditions: SQL[] = [];
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(ilike(reviews.comment, pattern), ilike(recipes.title, pattern))!);
  }
  if (ratingMin !== undefined && Number.isFinite(ratingMin)) {
    conditions.push(gte(reviews.rating, ratingMin));
  }
  if (ratingMax !== undefined && Number.isFinite(ratingMax)) {
    conditions.push(lte(reviews.rating, ratingMax));
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        userName: reviews.userName,
        userAvatar: reviews.userAvatar,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        recipeId: reviews.recipeId,
        recipeTitle: recipes.title,
        recipeImage: recipes.image,
      })
      .from(reviews)
      .leftJoin(recipes, eq(reviews.recipeId, recipes.id))
      .where(where)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(reviews)
      .leftJoin(recipes, eq(reviews.recipeId, recipes.id))
      .where(where),
  ]);

  return createResponse(
    { code: ApiResponseCode.Success },
    rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      userName: row.userName,
      userAvatar: row.userAvatar ?? undefined,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      recipeId: row.recipeId ?? undefined,
      recipeTitle: row.recipeTitle ?? undefined,
      recipeImage: row.recipeImage ?? undefined,
    })),
    { total: Number(totalRow[0]?.value ?? 0), limit, offset },
  );
});
