import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { categories } from "hub:db:schema";
import type { CategoryResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<CategoryResponse[]>> => {
  const query = getQuery(event);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const limit = clampLimit(query.limit);
  const offset = clampOffset(query.offset);

  const filters = [eq(categories.isDeleted, false)];
  if (search) filters.push(ilike(categories.name, `%${search}%`));
  const where = and(...filters);

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(where)
      .orderBy(desc(categories.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(categories).where(where),
  ]);

  const items: CategoryResponse[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return createResponse({ code: ApiResponseCode.Success }, items, {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
