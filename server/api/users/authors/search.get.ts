import { and, desc, eq, ilike, or } from "drizzle-orm";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UserResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse[]>> => {
  await requireUserSession(event);

  const query = getQuery(event);
  const search = typeof query.q === "string" ? query.q.trim() : "";
  if (!search) {
    return createResponse(
      { code: ApiResponseCode.InvalidRequest, message: "Query parameter 'q' is required" },
      null,
    );
  }

  const limit = clampLimit(query.limit, { default: 20 });
  const pattern = `%${search}%`;

  const rows = await db
    .select()
    .from(user)
    .where(
      and(
        eq(user.role, "author"),
        eq(user.banned, false),
        or(
          ilike(user.firstName, pattern),
          ilike(user.lastName, pattern),
          ilike(user.bio, pattern),
          ilike(user.expertise as never, pattern),
        ),
      ),
    )
    .orderBy(desc(user.followersCount))
    .limit(limit);

  return createResponse({ code: ApiResponseCode.Success }, rows.map(formatUserResponse));
});
