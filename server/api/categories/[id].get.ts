import { eq } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { categories } from "hub:db:schema";
import { ApiResponseCode } from "#shared/types";
import type { CategoryResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<CategoryResponse>> => {
  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Category id is required",
    });
  }

  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);

  if (!row || row.isDeleted) {
    return createResponse({
      code: ApiResponseCode.NotFound,
      message: "Category not found",
    });
  }

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    },
  );
});
