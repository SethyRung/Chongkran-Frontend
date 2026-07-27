import { count, desc } from "drizzle-orm";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UserResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse[]>> => {
  await requireAdmin(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);

  const [rows, totalRow] = await Promise.all([
    db.select().from(user).orderBy(desc(user.createdAt)).limit(limit).offset(offset),
    db.select({ value: count() }).from(user),
  ]);

  return createResponse({ code: ApiResponseCode.Success }, rows.map(formatUserResponse), {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
