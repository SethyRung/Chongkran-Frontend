import { and, eq } from "drizzle-orm";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UserResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse>> => {
  await requireSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Author id is required",
    });
  }

  const [row] = await db
    .select()
    .from(user)
    .where(and(eq(user.id, id), eq(user.role, "author")))
    .limit(1);

  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Author not found" });
  }

  return createResponse({ code: ApiResponseCode.Success }, formatUserResponse(row));
});
