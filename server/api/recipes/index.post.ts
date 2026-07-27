import { eq } from "drizzle-orm";
import { z } from "zod";
import { recipes, user } from "hub:db:schema";
import { Role } from "#shared/types";
import { formatRecipeResponse } from "~~/server/utils/recipe";
import type { RecipeResponse } from "#shared/types";

const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
});

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string()).default([]),
  image: z.string().min(1),
  cookTime: z.number().int().positive(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string().min(1),
});

export default defineEventHandler(async (event): Promise<ApiResponse<RecipeResponse>> => {
  const { user: sessionUser } = await requireRole(event, [Role.Admin, Role.Author]);

  const [author] = await db.select().from(user).where(eq(user.id, sessionUser.id)).limit(1);
  if (!author) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  const body = await readValidatedBody(event, createRecipeSchema.parse);

  const id = crypto.randomUUID();
  const [row] = await db
    .insert(recipes)
    .values({
      id,
      title: body.title,
      description: body.description ?? null,
      ingredients: body.ingredients,
      steps: body.steps,
      author: sessionUser.id,
      authorName: `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || author.name,
      authorAvatar: author.image ?? null,
      authorBio: author.bio ?? null,
      tags: body.tags,
      image: body.image,
      cookTime: body.cookTime,
      difficulty: body.difficulty,
      category: body.category,
    })
    .returning();

  if (!row) {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "Failed to create recipe",
    });
  }

  return createResponse({ code: ApiResponseCode.Success }, formatRecipeResponse(row));
});
