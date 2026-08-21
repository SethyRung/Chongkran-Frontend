import { count, eq, inArray } from "drizzle-orm";
import { categories, recipes, user } from "hub:db:schema";
import { Role } from "#shared/types";

export type StatsResponse = {
  recipes: number;
  categories: number;
  authors: number;
};

export default defineEventHandler(async (): Promise<ApiResponse<StatsResponse>> => {
  const [recipesRow, categoriesRow, authorsRow] = await Promise.all([
    db.select({ value: count() }).from(recipes).where(eq(recipes.status, "approved")),
    db.select({ value: count() }).from(categories).where(eq(categories.isDeleted, false)),
    db
      .select({ value: count() })
      .from(user)
      .where(inArray(user.role, [Role.Admin, Role.Author])),
  ]);

  return createResponse(
    { code: ApiResponseCode.Success },
    {
      recipes: Number(recipesRow[0]?.value ?? 0),
      categories: Number(categoriesRow[0]?.value ?? 0),
      authors: Number(authorsRow[0]?.value ?? 0),
    },
  );
});
