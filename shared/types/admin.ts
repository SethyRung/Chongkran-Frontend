export type AdminStatsSummary = {
  totalUsers: number;
  totalRecipes: number;
  totalPendingRecipes: number;
  totalPendingAuthorRequests: number;
  totalReviews: number;
};

export type AdminRoleCount = {
  role: string;
  count: number;
};

export type AdminDailyCount = {
  date: string;
  count: number;
};

export type AdminPopularRecipe = {
  id: string;
  title: string;
  image?: string;
  views: number;
  likes: number;
};

export type AdminActivityItem = {
  type: "user" | "recipe" | "review";
  description: string;
  timestamp?: string;
};

export type AdminRecentAuthorRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export type AdminRecentPendingRecipe = {
  id: string;
  title: string;
  image?: string;
  authorName?: string;
  createdAt: string;
};

export type AdminStatsResponse = {
  totalUsers: number;
  totalRecipes: number;
  totalPendingRecipes: number;
  totalPendingAuthorRequests: number;
  totalReviews: number;
  recentPendingRecipes: AdminRecentPendingRecipe[];
  recentPendingAuthorRequests: AdminRecentAuthorRequest[];
  usersByRole: AdminRoleCount[];
  userTrendSeries: AdminDailyCount[];
  recipeTrendSeries: AdminDailyCount[];
  popularRecipes: AdminPopularRecipe[];
  recentActivity: AdminActivityItem[];
};
