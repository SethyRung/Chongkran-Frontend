import { eq } from "drizzle-orm";
import { z } from "zod";
import { recipes } from "hub:db:schema";
import { aggregateLikesForRecipes, formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "#shared/types";

const updateRecipeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.string().min(1),
      }),
    )
    .min(1)
    .optional(),
  steps: z.array(z.string().min(1)).min(1).optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().min(1).optional(),
  cookTime: z.number().int().positive().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  category: z.string().min(1).optional(),
});

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  const [existing] = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  if (existing.author !== sessionUser.id && sessionUser.role !== "admin") {
    return createResponse({ code: ApiResponseCode.Forbidden, message: "Not authorized" });
  }

  const body = await readValidatedBody(event, updateRecipeSchema.parse);

  const updates: Partial<typeof recipes.$inferInsert> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.ingredients !== undefined) updates.ingredients = body.ingredients;
  if (body.steps !== undefined) updates.steps = body.steps;
  if (body.tags !== undefined) updates.tags = body.tags;
  if (body.image !== undefined) updates.image = body.image;
  if (body.cookTime !== undefined) updates.cookTime = body.cookTime;
  if (body.difficulty !== undefined) updates.difficulty = body.difficulty;
  if (body.category !== undefined) updates.category = body.category;

  if (Object.keys(updates).length === 0) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "No fields to update" });
  }

  const [row] = await db.update(recipes).set(updates).where(eq(recipes.id, id)).returning();

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  const likesMap = await aggregateLikesForRecipes([row.id]);

  return createResponse(
    { code: ApiResponseCode.Success },
    formatRecipeResponse(row, likesMap.get(row.id)),
  );
});
