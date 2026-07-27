import { eq } from "drizzle-orm";
import { reviews } from "hub:db:schema";
import { formatReviewResponse } from "~~/server/utils/review";
import type { ReviewResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<ReviewResponse>> => {
  await requireSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Review id is required",
    });
  }

  const [row] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Review not found" });
  }

  return createResponse({ code: ApiResponseCode.Success }, formatReviewResponse(row));
});
