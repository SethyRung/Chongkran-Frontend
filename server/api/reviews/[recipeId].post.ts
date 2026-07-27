import { eq } from "drizzle-orm";
import { z } from "zod";
import { recipes, reviews, user } from "hub:db:schema";
import { formatReviewResponse } from "~~/server/utils/review";
import type { ReviewResponse } from "~~/server/types";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export default defineEventHandler(async (event): Promise<ApiResponse<ReviewResponse>> => {
  const recipeId = getRouterParam(event, "recipeId");
  if (!recipeId) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Recipe id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  const [recipe] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(eq(recipes.id, recipeId))
    .limit(1);
  if (!recipe) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Recipe not found" });
  }

  const [author] = await db.select().from(user).where(eq(user.id, sessionUser.id)).limit(1);
  if (!author) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  const body = await readValidatedBody(event, createReviewSchema.parse);

  const id = crypto.randomUUID();
  const [row] = await db
    .insert(reviews)
    .values({
      id,
      recipeId,
      userId: sessionUser.id,
      userName: `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || author.name,
      userAvatar: author.image ?? null,
      rating: body.rating,
      comment: body.comment,
    })
    .returning();

  if (!row) {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "Failed to create review",
    });
  }

  return createResponse({ code: ApiResponseCode.Success }, formatReviewResponse(row));
});
