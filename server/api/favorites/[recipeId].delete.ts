import { and, eq } from "drizzle-orm";
import { favorites } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<{ message: string }>> => {
  const recipeId = getRouterParam(event, "recipeId");
  if (!recipeId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, sessionUser.id), eq(favorites.recipeId, recipeId)));

  return createResponse(
    { code: ApiResponseCode.Success },
    { message: "Recipe removed from favorites" },
  );
});
