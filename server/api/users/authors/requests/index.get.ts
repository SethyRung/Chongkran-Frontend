import { and, count, desc, eq, isNotNull, type SQL } from "drizzle-orm";
import { user } from "hub:db:schema";
import type { AuthorRequestResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<AuthorRequestResponse[]>> => {
  await requireAdmin(event);

  const query = getQuery(event);
  const limit = clampLimit(query.limit, { default: 10 });
  const offset = clampOffset(query.offset);
  const status = query.status as "pending" | "approved" | "rejected" | undefined;

  const filters: SQL[] = [isNotNull(user.authorRequestStatus)];
  if (status) {
    filters.push(eq(user.authorRequestStatus, status));
  }

  const where = and(...filters);

  const [rows, totalRow] = await Promise.all([
    db.select().from(user).where(where).orderBy(desc(user.createdAt)).limit(limit).offset(offset),
    db.select({ value: count() }).from(user).where(where),
  ]);

  const data: AuthorRequestResponse[] = rows.map((row) => ({
    id: row.id,
    user: {
      id: row.id,
      firstName: row.firstName ?? "",
      lastName: row.lastName ?? "",
      email: row.email,
      avatar: row.image ?? undefined,
    },
    status: row.authorRequestStatus as "pending" | "approved" | "rejected",
  }));

  return createResponse({ code: ApiResponseCode.Success }, data, {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
