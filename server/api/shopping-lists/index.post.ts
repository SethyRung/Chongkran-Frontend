import { eq } from "drizzle-orm";
import { z } from "zod";
import { shoppingLists } from "hub:db:schema";
import type { ShoppingListResponse } from "#shared/types";

const shoppingItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
  checked: z.boolean().default(false),
});

const createShoppingListSchema = z.object({
  items: z.array(shoppingItemSchema).default([]),
});

export default defineEventHandler(async (event): Promise<ApiResponse<ShoppingListResponse>> => {
  const { user: sessionUser } = await requireSession(event);

  const [existing] = await db
    .select({ id: shoppingLists.id })
    .from(shoppingLists)
    .where(eq(shoppingLists.userId, sessionUser.id))
    .limit(1);

  if (existing) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "List is already exist",
    });
  }

  const body = await readValidatedBody(event, createShoppingListSchema.parse);

  const id = crypto.randomUUID();
  const [row] = await db
    .insert(shoppingLists)
    .values({
      id,
      userId: sessionUser.id,
      items: body.items,
    })
    .returning();

  if (!row) {
    return createResponse({
      code: ApiResponseCode.InternalError,
      message: "Failed to create shopping list",
    });
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
