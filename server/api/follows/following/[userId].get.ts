import { count, eq, inArray } from "drizzle-orm";
import { follows, user } from "hub:db:schema";
import type { UserResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse[]>> => {
  const userId = getRouterParam(event, "userId");
  if (!userId) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const [target] = await db.select({ id: user.id }).from(user).where(eq(user.id, userId)).limit(1);
  if (!target) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  const [followingIds, totalRow] = await Promise.all([
    db
      .select({ id: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId))
      .orderBy(follows.createdAt)
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(follows).where(eq(follows.followerId, userId)),
  ]);

  const ids = followingIds.map((row) => row.id);
  if (ids.length === 0) {
    return createResponse({ code: ApiResponseCode.Success }, [], {
      total: Number(totalRow[0]?.value ?? 0),
      limit,
      offset,
    });
  }

  const following = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      role: user.role,
    })
    .from(user)
    .where(inArray(user.id, ids));

  const data: UserResponse[] = following.map((row) => ({
    id: row.id,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    email: row.email,
    role: row.role as UserResponse["role"],
    avatar: row.image ?? undefined,
  }));

  return createResponse({ code: ApiResponseCode.Success }, data, {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
