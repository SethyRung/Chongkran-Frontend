import { and, eq } from "drizzle-orm";
import { mealPlans } from "hub:db:schema";
import type { MealPlanResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<MealPlanResponse>> => {
  const { user: sessionUser } = await requireSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Meal plan id is required",
    });
  }

  const [row] = await db
    .select()
    .from(mealPlans)
    .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, sessionUser.id)))
    .limit(1);

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Plan not found" });
  }

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      id: row.id,
      userId: row.userId,
      title: row.title,
      recipes: row.recipes,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    },
  );
});
