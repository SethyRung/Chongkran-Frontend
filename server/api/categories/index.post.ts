import { z } from "zod";
import { db } from "@nuxthub/db";
import { categories } from "hub:db:schema";
import type { CategoryResponse } from "#shared/types";

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export default defineEventHandler(async (event): Promise<ApiResponse<CategoryResponse>> => {
  await requireAdmin(event);

  const body = await readValidatedBody(event, createCategorySchema.parse);
  const id = crypto.randomUUID();

  const [row] = await db
    .insert(categories)
    .values({
      id,
      name: body.name,
      description: body.description ?? null,
    })
    .returning();

  if (!row) {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "Failed to create category",
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
