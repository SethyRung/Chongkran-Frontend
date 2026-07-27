import { eq } from "drizzle-orm";
import { user } from "hub:db:schema";

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  await requireAdmin(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({ code: ApiResponseCode.InvalidRequest, message: "User id is required" });
  }

  const [existing] = await db
    .update(user)
    .set({ banned: true, banReason: "Deleted by admin" })
    .where(eq(user.id, id))
    .returning({ id: user.id });

  if (!existing) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  return createResponse(
    { code: ApiResponseCode.Success, message: "User deleted successfully" },
    null,
  );
});
