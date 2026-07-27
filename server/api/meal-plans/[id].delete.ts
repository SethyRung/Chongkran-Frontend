import { and, eq } from "drizzle-orm";
import { mealPlans } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user: sessionUser } = await requireSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Meal plan id is required",
    });
  }

  const [existing] = await db
    .delete(mealPlans)
    .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, sessionUser.id)))
    .returning({ id: mealPlans.id });

  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Plan not found" });
  }

  return createResponse(
    { code: ApiResponseCode.Success, message: "Plan deleted successfully" },
    null,
  );
});
