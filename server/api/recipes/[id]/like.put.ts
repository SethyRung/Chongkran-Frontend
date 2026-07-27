import { and, eq } from "drizzle-orm";
import { recipeLikes, recipes } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireUserSession(event);

  const [recipe] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);
  if (!recipe) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  const [existing] = await db
    .select({ recipeId: recipeLikes.recipeId })
    .from(recipeLikes)
    .where(and(eq(recipeLikes.recipeId, id), eq(recipeLikes.userId, sessionUser.id)))
    .limit(1);

  if (existing) {
    await db
      .delete(recipeLikes)
      .where(and(eq(recipeLikes.recipeId, id), eq(recipeLikes.userId, sessionUser.id)));
  } else {
    await db.insert(recipeLikes).values({ recipeId: id, userId: sessionUser.id });
  }

  return createResponse({ code: ApiResponseCode.Success }, null);
});
