import { eq, sql } from "drizzle-orm";
import { recipes } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  await db
    .update(recipes)
    .set({ views: sql`${recipes.views} + 1` })
    .where(eq(recipes.id, id));

  return createResponse({ code: ApiResponseCode.Success }, null);
});
