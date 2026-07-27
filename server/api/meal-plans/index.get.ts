import { count, desc, eq } from "drizzle-orm";
import { mealPlans } from "hub:db:schema";
import type { MealPlanResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<MealPlanResponse[]>> => {
  const { user: sessionUser } = await requireUserSession(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, sessionUser.id))
      .orderBy(desc(mealPlans.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(mealPlans).where(eq(mealPlans.userId, sessionUser.id)),
  ]);

  return createResponse(
    { code: ApiResponseCode.Success },
    rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      recipes: row.recipes,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })),
    { total: Number(totalRow[0]?.value ?? 0), limit, offset },
  );
});
