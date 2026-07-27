import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { mealPlans } from "hub:db:schema";
import type { MealPlanResponse } from "~~/server/types";

const recipeEntrySchema = z.object({
  recipeId: z.string().min(1),
  day: z.string().min(1),
  mealType: z.string().min(1),
});

const updateMealPlanSchema = z.object({
  title: z.string().min(1).optional(),
  recipes: z.array(recipeEntrySchema).min(1).optional(),
});

export default defineEventHandler(async (event): Promise<ApiResponse<MealPlanResponse>> => {
  const { user: sessionUser } = await requireUserSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Meal plan id is required",
    });
  }

  const body = await readValidatedBody(event, updateMealPlanSchema.parse);

  const updates: Partial<typeof mealPlans.$inferInsert> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.recipes !== undefined) updates.recipes = body.recipes;

  if (Object.keys(updates).length === 0) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "No fields to update" });
  }

  const [row] = await db
    .update(mealPlans)
    .set(updates)
    .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, sessionUser.id)))
    .returning();

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Plan not found" });
  }

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      id: row.id,
      userId: row.userId,
      title: row.title,
      recipes: row.recipes,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    },
  );
});
