import { eq } from "drizzle-orm";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse>> => {
  await requireAdmin(event);

  const query = getQuery(event);
  const id = typeof query.id === "string" ? query.id : "";
  const status = query.status as "pending" | "approved" | "rejected" | undefined;

  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }
  if (status !== "pending" && status !== "approved" && status !== "rejected") {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Status must be 'pending', 'approved', or 'rejected'",
    });
  }

  const [row] = await db.update(recipes).set({ status }).where(eq(recipes.id, id)).returning();

  if (!row) {
    return createResponse({
      code: ApiResponseCode.NotFound,
      message: "Recipe not found. Please check the information and try again.",
    });
  }

  const likesMap = await aggregateLikesForRecipes([row.id]);

  return createResponse(
    { code: ApiResponseCode.Success },
    formatRecipeResponse(row, likesMap.get(row.id)),
  );
});
