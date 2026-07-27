import { eq } from "drizzle-orm";
import { reviews } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Review id is required",
    });
  }

  const { user: sessionUser } = await requireUserSession(event);

  const [existing] = await db
    .select({ userId: reviews.userId })
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);
  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Review not found" });
  }

  if (existing.userId !== sessionUser.id) {
    return createResponse({ code: ApiResponseCode.Forbidden, message: "Not authorized" });
  }

  await db.delete(reviews).where(eq(reviews.id, id));

  return createResponse(
    { code: ApiResponseCode.Success, message: "Review deleted successfully" },
    null,
  );
});
