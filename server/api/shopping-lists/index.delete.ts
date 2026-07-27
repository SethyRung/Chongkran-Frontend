import { eq } from "drizzle-orm";
import { shoppingLists } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  const { user: sessionUser } = await requireSession(event);

  const [existing] = await db
    .delete(shoppingLists)
    .where(eq(shoppingLists.userId, sessionUser.id))
    .returning({ id: shoppingLists.id });

  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "List not found." });
  }

  return createResponse(
    { code: ApiResponseCode.Success, message: "List deleted successfully" },
    null,
  );
});
