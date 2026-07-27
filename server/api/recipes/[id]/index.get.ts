import { eq } from "drizzle-orm";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const [row] = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  const likesMap = await aggregateLikesForRecipes([row.id]);

  return createResponse(
    { code: ApiResponseCode.Success },
    formatRecipeResponse(row, likesMap.get(row.id)),
  );
});
