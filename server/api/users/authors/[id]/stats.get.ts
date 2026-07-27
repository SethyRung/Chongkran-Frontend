import { and, count, eq } from "drizzle-orm";
import { recipes, user } from "hub:db:schema";
import type { AuthorStats } from "~~/server/types";

export default defineEventHandler(async (event): Promise<ApiResponse<AuthorStats>> => {
  await requireSession(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    return createResponse({
      code: ApiResponseCode.InvalidRequest,
      message: "Author id is required",
    });
  }

  const [author] = await db
    .select()
    .from(user)
    .where(and(eq(user.id, id), eq(user.role, "author")))
    .limit(1);

  if (!author) {
    return createResponse({ code: ApiResponseCode.NotFound, message: "Author not found" });
  }

  const [recipesCount] = await db
    .select({ value: count() })
    .from(recipes)
    .where(eq(recipes.author, id));

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      recipesCount: recipesCount?.value ?? 0,
      followersCount: author.followersCount ?? 0,
      followingCount: author.followingCount ?? 0,
      totalViews: author.totalViews ?? 0,
      totalLikes: author.totalLikes ?? 0,
    },
  );
});
