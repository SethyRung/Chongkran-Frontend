import { eq } from "drizzle-orm";
import { z } from "zod";
import { reviews } from "hub:db:schema";
import { formatReviewResponse } from "~~/server/utils/review";
import type { ReviewResponse } from "#shared/types";

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1).optional(),
});

export default defineEventHandler(async (event): Promise<ApiResponse<ReviewResponse>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Review id is required",
    });
  }

  const { user: sessionUser } = await requireSession(event);

  const [existing] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Review not found" });
  }

  if (existing.userId !== sessionUser.id) {
    return createResponse({ code: ApiResponseCode.Forbidden, message: "Not authorized" });
  }

  const body = await readValidatedBody(event, updateReviewSchema.parse);

  const updates: Partial<typeof reviews.$inferInsert> = {};
  if (body.rating !== undefined) updates.rating = body.rating;
  if (body.comment !== undefined) updates.comment = body.comment;

  if (Object.keys(updates).length === 0) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "No fields to update" });
  }

  const [row] = await db.update(reviews).set(updates).where(eq(reviews.id, id)).returning();

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Review not found" });
  }

  return createResponse({ code: ApiResponseCode.Success }, formatReviewResponse(row));
});
