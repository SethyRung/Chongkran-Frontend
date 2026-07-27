import { eq } from "drizzle-orm";
import { user } from "hub:db:schema";
import { formatUserResponse } from "~~/server/utils/user";
import type { UserResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<UserResponse>> => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  if (!row) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  return createResponse({ code: ApiResponseCode.Success }, formatUserResponse(row));
});
