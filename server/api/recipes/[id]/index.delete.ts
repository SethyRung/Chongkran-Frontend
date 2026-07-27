import { eq } from "drizzle-orm";
import { recipes } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  const [existing] = await db
    .select({ author: recipes.author })
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);
  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  if (existing.author !== sessionUser.id && sessionUser.role !== "admin") {
    return createResponse({ code: ApiResponseCode.Forbidden, message: "Not authorized" });
  }

  await db.delete(recipes).where(eq(recipes.id, id));

  return createResponse(
    { code: ApiResponseCode.Success, message: "Recipe deleted successfully" },
    null,
  );
});
