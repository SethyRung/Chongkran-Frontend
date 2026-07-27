export type ReviewUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
};

export type ReviewRecipe = {
  id: string;
  title?: string;
  image?: string;
};

export type ReviewResponse = {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  user?: ReviewUser;
  recipeId?: string;
  recipeTitle?: string;
  recipeImage?: string;
  recipe?: ReviewRecipe;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReviewDto = {
  rating: number;
  comment: string;
};

export type UpdateReviewDto = {
  rating?: number;
  comment?: string;
};
