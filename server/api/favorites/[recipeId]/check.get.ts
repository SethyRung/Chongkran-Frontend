import { and, eq } from "drizzle-orm";
import { favorites } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<{ isFavorite: boolean }>> => {
  const recipeId = getRouterParam(event, "recipeId");
  if (!recipeId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  const [row] = await db
    .select({ userId: favorites.userId })
    .from(favorites)
    .where(and(eq(favorites.userId, sessionUser.id), eq(favorites.recipeId, recipeId)))
    .limit(1);

  return createResponse({ code: ApiResponseCode.Success }, { isFavorite: !!row });
});
