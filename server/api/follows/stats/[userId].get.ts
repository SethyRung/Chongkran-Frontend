import { eq } from "drizzle-orm";
import { user } from "hub:db:schema";
import type { FollowStatsResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<FollowStatsResponse>> => {
  const userId = getRouterParam(event, "userId");
  if (!userId) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const [row] = await db
    .select({ followersCount: user.followersCount, followingCount: user.followingCount })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      followersCount: row.followersCount ?? 0,
      followingCount: row.followingCount ?? 0,
    },
  );
});
