import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { categories, recipes } from "hub:db:schema";
import type { CategoryResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<CategoryResponse[]>> => {
  const query = getQuery(event);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const limit = clampLimit(query.limit);
  const offset = clampOffset(query.offset);

  const filters = [eq(categories.isDeleted, false)];
  if (search) filters.push(ilike(categories.name, `%${search}%`));
  const where = and(...filters);

  const [rows, totalRow, countRows] = await Promise.all([
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
    db
      .select({ category: recipes.category, value: count() })
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .groupBy(recipes.category),
  ]);

  const recipeCountByCategory = new Map(countRows.map((r) => [r.category, Number(r.value)]));

  const items: CategoryResponse[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    recipeCount: recipeCountByCategory.get(row.id) ?? 0,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return createResponse({ code: ApiResponseCode.Success }, items, {
    total: Number(totalRow[0]?.value ?? 0),
    limit,
    offset,
  });
});
