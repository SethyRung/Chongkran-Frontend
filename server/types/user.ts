export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: Date | string;
};

export type UpdateAuthorProfileDto = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  expertise?: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
    facebook?: string;
  };
  avatar?: string;
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
};

export type AuthorStats = {
  recipesCount: number;
  followersCount: number;
  followingCount?: number;
  totalViews: number;
  totalLikes: number;
  averageRating?: number;
};

export type AuthorRequestUserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export type AuthorRequestResponse = {
  id: string;
  user: AuthorRequestUserInfo;
  status: "pending" | "approved" | "rejected";
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  dateOfBirth?: Date | string;
  role: Role;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  followersCount?: number;
  followingCount?: number;
  recipesCount?: number;
  totalViews?: number;
  totalLikes?: number;
  authorRequestStatus?: "pending" | "approved" | "rejected";
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
