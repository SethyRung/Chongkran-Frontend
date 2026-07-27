import { eq } from "drizzle-orm";
import { z } from "zod";
import { shoppingLists } from "hub:db:schema";
import type { ShoppingListResponse } from "~~/server/types";

const shoppingItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
  checked: z.boolean().default(false),
});

const updateShoppingListSchema = z.object({
  items: z.array(shoppingItemSchema).min(1),
});

export default defineEventHandler(async (event): Promise<ApiResponse<ShoppingListResponse>> => {
  const { user: sessionUser } = await requireUserSession(event);

  const body = await readValidatedBody(event, updateShoppingListSchema.parse);

  const [row] = await db
    .update(shoppingLists)
    .set({ items: body.items })
    .where(eq(shoppingLists.userId, sessionUser.id))
    .returning();

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "List not found" });
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
