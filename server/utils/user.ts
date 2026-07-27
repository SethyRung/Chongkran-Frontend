import { user } from "hub:db:schema";
import type { UserResponse } from "~~/server/types";

export type UserRow = typeof user.$inferSelect;

export function formatUserResponse(row: UserRow): UserResponse {
  return {
    id: row.id,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    email: row.email,
    role: (row.role ?? "user") as UserResponse["role"],
    avatar: row.image ?? undefined,
    bio: row.bio ?? undefined,
    expertise: row.expertise ?? undefined,
    followersCount: row.followersCount ?? 0,
    followingCount: row.followingCount ?? 0,
    recipesCount: row.recipesCount ?? 0,
    totalViews: row.totalViews ?? 0,
    totalLikes: row.totalLikes ?? 0,
    authorRequestStatus: row.authorRequestStatus as UserResponse["authorRequestStatus"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
