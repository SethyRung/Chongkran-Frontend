import { eq } from "drizzle-orm";
import { shoppingLists } from "hub:db:schema";
import type { ShoppingListResponse } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<ShoppingListResponse>> => {
  const { user: sessionUser } = await requireSession(event);

  const [row] = await db
    .select()
    .from(shoppingLists)
    .where(eq(shoppingLists.userId, sessionUser.id))
    .limit(1);

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "List not found." });
  }

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      id: row.id,
      userId: row.userId,
      items: row.items,
      createdAt: row.createdAt.toISOString(),
    },
  );
});
