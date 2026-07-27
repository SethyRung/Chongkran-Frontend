import { reviews } from "hub:db:schema";
import type { ReviewResponse } from "~~/server/types";

export type ReviewRow = typeof reviews.$inferSelect;

export function formatReviewResponse(
  row: ReviewRow,
  extras?: { recipeId?: string; recipeTitle?: string; recipeImage?: string },
): ReviewResponse {
  return {
    id: row.id,
    userId: row.userId,
    userName: row.userName,
    userAvatar: row.userAvatar ?? undefined,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    ...(extras ?? {}),
  };
}
