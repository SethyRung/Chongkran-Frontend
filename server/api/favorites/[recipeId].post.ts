import { eq } from "drizzle-orm";
import { favorites, recipes } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<{ message: string }>> => {
  const recipeId = getRouterParam(event, "recipeId");
  if (!recipeId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireUserSession(event);

  const [recipe] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(eq(recipes.id, recipeId))
    .limit(1);
  if (!recipe) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  await db.insert(favorites).values({ userId: sessionUser.id, recipeId }).onConflictDoNothing();

  return createResponse(
    { code: ApiResponseCode.Success },
    { message: "Recipe added to favorites" },
  );
});
