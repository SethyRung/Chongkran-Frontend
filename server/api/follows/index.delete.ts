import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { follows, user } from "hub:db:schema";

const unfollowSchema = z.object({
  followingId: z.string().min(1),
});

export default defineEventHandler(async (event): Promise<ApiResponse<{ message: string }>> => {
  const { user: sessionUser } = await requireUserSession(event);

  const body = await readValidatedBody(event, unfollowSchema.parse);

  const [following] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, body.followingId))
    .limit(1);
  if (!following) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "User not found" });
  }

  const [existing] = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, sessionUser.id), eq(follows.followingId, body.followingId)))
    .limit(1);
  if (!existing) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Not following this user",
    });
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(follows)
      .where(
        and(eq(follows.followerId, sessionUser.id), eq(follows.followingId, body.followingId)),
      );
    await tx
      .update(user)
      .set({ followingCount: sql`GREATEST(${user.followingCount} - 1, 0)` })
      .where(eq(user.id, sessionUser.id));
    await tx
      .update(user)
      .set({ followersCount: sql`GREATEST(${user.followersCount} - 1, 0)` })
      .where(eq(user.id, body.followingId));
  });

  return createResponse(
    { code: ApiResponseCode.Success },
    { message: "Successfully unfollowed user" },
  );
});
