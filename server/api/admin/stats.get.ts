import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { recipes, recipeLikes, reviews, user } from "hub:db:schema";
import type { AdminStatsResponse } from "#shared/types";

export default defineEventHandler(async (event): Promise<ApiResponse<AdminStatsResponse>> => {
  await requireAdmin(event);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalUsersRow,
    totalRecipesRow,
    totalPendingRecipesRow,
    totalPendingAuthorRequestsRow,
    totalReviewsRow,
    recentPendingRecipes,
    recentPendingAuthorRequests,
    usersByRoleRows,
    userTrendRows,
    recipeTrendRows,
    popularRecipesRows,
    recentUsersRows,
    recentRecipesRows,
    recentReviewsRows,
  ] = await Promise.all([
    db.select({ value: count() }).from(user).where(eq(user.banned, false)),
    db.select({ value: count() }).from(recipes),
    db.select({ value: count() }).from(recipes).where(eq(recipes.status, "pending")),
    db
      .select({ value: count() })
      .from(user)
      .where(and(eq(user.banned, false), eq(user.authorRequestStatus, "pending"))),
    db.select({ value: count() }).from(reviews),
    db
      .select({
        id: recipes.id,
        title: recipes.title,
        authorName: recipes.authorName,
        image: recipes.image,
        createdAt: recipes.createdAt,
      })
      .from(recipes)
      .where(eq(recipes.status, "pending"))
      .orderBy(desc(recipes.createdAt))
      .limit(5),
    db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.image,
      })
      .from(user)
      .where(and(eq(user.banned, false), eq(user.authorRequestStatus, "pending")))
      .orderBy(desc(user.createdAt))
      .limit(5),
    db
      .select({ role: user.role, count: count() })
      .from(user)
      .where(eq(user.banned, false))
      .groupBy(user.role),
    db
      .select({
        date: sql<string>`DATE(created_at)`,
        count: count(),
      })
      .from(user)
      .where(and(eq(user.banned, false), gte(user.createdAt, thirtyDaysAgo)))
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at)`),
    db
      .select({
        date: sql<string>`DATE(created_at)`,
        count: count(),
      })
      .from(recipes)
      .where(gte(recipes.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at)`),
    db
      .select({
        id: recipes.id,
        title: recipes.title,
        image: recipes.image,
        views: recipes.views,
      })
      .from(recipes)
      .orderBy(desc(recipes.views))
      .limit(5),
    db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.banned, false))
      .orderBy(desc(user.createdAt))
      .limit(3),
    db
      .select({
        id: recipes.id,
        title: recipes.title,
        authorName: recipes.authorName,
        createdAt: recipes.createdAt,
      })
      .from(recipes)
      .orderBy(desc(recipes.createdAt))
      .limit(3),
    db
      .select({
        id: reviews.id,
        userName: reviews.userName,
        recipeId: reviews.recipeId,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .orderBy(desc(reviews.createdAt))
      .limit(3),
  ]);

  const popularRecipeIds = popularRecipesRows.map((row) => row.id);
  const likeCountsByRecipe = new Map<string, number>();
  if (popularRecipeIds.length > 0) {
    const likeRows = await db
      .select({ recipeId: recipeLikes.recipeId })
      .from(recipeLikes)
      .where(inArray(recipeLikes.recipeId, popularRecipeIds));
    for (const row of likeRows) {
      likeCountsByRecipe.set(row.recipeId, (likeCountsByRecipe.get(row.recipeId) ?? 0) + 1);
    }
  }

  const recipeTitleById = new Map<string, string>();
  for (const row of recentRecipesRows) recipeTitleById.set(row.id, row.title);

  const recentActivity = [
    ...recentUsersRows.map((u) => ({
      type: "user" as const,
      description: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() + " joined",
      timestamp: u.createdAt.toISOString(),
    })),
    ...recentRecipesRows.map((r) => ({
      type: "recipe" as const,
      description: `${r.authorName} published "${r.title}"`,
      timestamp: r.createdAt.toISOString(),
    })),
    ...recentReviewsRows.map((r) => ({
      type: "review" as const,
      description: `${r.userName} commented on "${recipeTitleById.get(r.recipeId) ?? "a recipe"}"`,
      timestamp: r.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      totalUsers: Number(totalUsersRow[0]?.value ?? 0),
      totalRecipes: Number(totalRecipesRow[0]?.value ?? 0),
      totalPendingRecipes: Number(totalPendingRecipesRow[0]?.value ?? 0),
      totalPendingAuthorRequests: Number(totalPendingAuthorRequestsRow[0]?.value ?? 0),
      totalReviews: Number(totalReviewsRow[0]?.value ?? 0),
      recentPendingRecipes: recentPendingRecipes.map((r) => ({
        id: r.id,
        title: r.title,
        authorName: r.authorName,
        image: r.image,
        createdAt: r.createdAt.toISOString(),
      })),
      recentPendingAuthorRequests: recentPendingAuthorRequests.map((u) => ({
        id: u.id,
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        email: u.email,
        avatar: u.avatar ?? undefined,
      })),
      usersByRole: usersByRoleRows.map((r) => ({
        role: r.role ?? "user",
        count: Number(r.count),
      })),
      userTrendSeries: userTrendRows.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
      recipeTrendSeries: recipeTrendRows.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
      popularRecipes: popularRecipesRows.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        views: r.views,
        likes: likeCountsByRecipe.get(r.id) ?? 0,
      })),
      recentActivity,
    },
  );
});
