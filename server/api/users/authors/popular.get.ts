import { and, desc, eq } from "drizzle-orm";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UserResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse[]>> => {
  await requireSession(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });

  const rows = await db
    .select()
    .from(user)
    .where(and(eq(user.role, "author"), eq(user.banned, false)))
    .orderBy(desc(user.followersCount), desc(user.recipesCount))
    .limit(limit);

  return createResponse({ code: ApiResponseCode.Success }, rows.map(formatUserResponse));
});
