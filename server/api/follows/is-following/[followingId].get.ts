import { and, eq } from "drizzle-orm";
import { follows } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<{ isFollowing: boolean }>> => {
  const followingId = getRouterParam(event, "followingId");
  if (!followingId) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const { user: sessionUser } = await requireUserSession(event);

  const [row] = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, sessionUser.id), eq(follows.followingId, followingId)))
    .limit(1);

  return createResponse({ code: ApiResponseCode.Success }, { isFollowing: !!row });
});
