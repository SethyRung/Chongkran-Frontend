import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@nuxthub/db";
import { categories } from "hub:db:schema";
import { CategoryResponse } from "~~/server/types";

const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
});

export default defineEventHandler(async (event): Promise<ApiResponse<CategoryResponse>> => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Category id is required",
    });
  }

  const body = await readValidatedBody(event, updateCategorySchema.parse);

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;

  if (Object.keys(updates).length === 0) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "No fields to update",
    });
  }

  const [row] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();

  if (!row) {
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
