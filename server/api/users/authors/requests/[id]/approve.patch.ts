import { eq } from "drizzle-orm";
import { user } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<{ message: string }>> => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const [existing] = await db
    .select({ authorRequestStatus: user.authorRequestStatus })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  if (existing.authorRequestStatus === "approved") {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "This request has already been approved.",
    });
  }

  await db
    .update(user)
    .set({ authorRequestStatus: "approved", role: "author" })
    .where(eq(user.id, id));

  await refreshSessionCookieCache(event);

  return createResponse(
    { code: ApiResponseCode.Success },
    { message: "Author request approved successfully." },
  );
});
