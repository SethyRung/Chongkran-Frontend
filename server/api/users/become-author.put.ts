import { eq } from "drizzle-orm";
import { user } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<{ message: string }>> => {
  const { user: sessionUser } = await requireSession(event);

  const [existing] = await db
    .select({ authorRequestStatus: user.authorRequestStatus })
    .from(user)
    .where(eq(user.id, sessionUser.id))
    .limit(1);

  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  if (existing.authorRequestStatus) {
    return createResponse({ code: ApiResponseCode.Success }, { message: "Waiting for approval" });
  }

  await db.update(user).set({ authorRequestStatus: "pending" }).where(eq(user.id, sessionUser.id));

  await refreshSessionCookieCache(event);

  return createResponse({ code: ApiResponseCode.Success }, { message: "Waiting for approval" });
});
