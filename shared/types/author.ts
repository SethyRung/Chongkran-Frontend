import type { UserResponse } from "./user";

export type AuthorRequestUser = Pick<
  UserResponse,
  "id" | "firstName" | "lastName" | "email" | "avatar"
>;

export type AuthorRequestResponse = {
  id: string;
  user: AuthorRequestUser;
  status: "pending" | "approved" | "rejected";
};

export type Author = {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  followersCount?: number;
  recipesCount?: number;
};
