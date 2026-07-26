import { eq } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { categories } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Category id is required",
    });
  }

  const [row] = await db
    .update(categories)
    .set({ isDeleted: true })
    .where(eq(categories.id, id))
    .returning({ id: categories.id });

  if (!row) {
    return createResponse({
      code: ApiResponseCode.NotFound,
      message: "Category not found",
    });
  }

  return createResponse({ code: ApiResponseCode.Success, message: "Category deleted" }, null);
});
