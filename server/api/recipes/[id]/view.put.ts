import { eq, sql } from "drizzle-orm";
import { recipes, recipeViews } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user } = await requireSession(event);

  // Insert a view row; only bump the counter on first view by this user.
  const [inserted] = await db
    .insert(recipeViews)
    .values({ recipeId: id, userId: user.id })
    .onConflictDoNothing()
    .returning({ recipeId: recipeViews.recipeId });

  if (inserted) {
    await db
      .update(recipes)
      .set({ views: sql`${recipes.views} + 1` })
      .where(eq(recipes.id, id));
  }

  return createResponse({ code: ApiResponseCode.Success }, null);
});
