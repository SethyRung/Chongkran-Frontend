import { z } from "zod";
import { mealPlans } from "hub:db:schema";
import type { MealPlanResponse } from "#shared/types";

const recipeEntrySchema = z.object({
  recipeId: z.string().min(1),
  day: z.string().min(1),
  mealType: z.string().min(1),
});

const createMealPlanSchema = z.object({
  title: z.string().min(1),
  recipes: z.array(recipeEntrySchema).min(1),
});

export default defineEventHandler(async (event): Promise<ApiResponse<MealPlanResponse>> => {
  const { user: sessionUser } = await requireSession(event);

  const body = await readValidatedBody(event, createMealPlanSchema.parse);

  const id = crypto.randomUUID();
  const [row] = await db
    .insert(mealPlans)
    .values({
      id,
      userId: sessionUser.id,
      title: body.title,
      recipes: body.recipes,
    })
    .returning();

  if (!row) {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "Failed to create meal plan",
    });
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
