import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UserResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse[]>> => {
  await requireUserSession(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const expertise = typeof query.expertise === "string" ? query.expertise.trim() : "";

  const filters = [eq(user.role, "author"), eq(user.banned, false)];
  if (search) {
    const pattern = `%${search}%`;
    filters.push(
      or(ilike(user.firstName, pattern), ilike(user.lastName, pattern), ilike(user.bio, pattern))!,
    );
  }
  if (expertise) {
    filters.push(ilike(user.expertise as never, `%${expertise}%`)!);
  }

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(user)
      .where(and(...filters))
      .orderBy(desc(user.followersCount), desc(user.recipesCount))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(user)
      .where(and(...filters)),
  ]);

  return createResponse({ code: ApiResponseCode.Success }, rows.map(formatUserResponse), {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
