export type RecipeEntry = {
  recipeId: string;
  day: string;
  mealType: string;
};

export type MealPlanUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
};

export type MealPlanResponse = {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  user?: MealPlanUser;
  title: string;
  recipes: RecipeEntry[];
  createdAt: string;
  updatedAt: string;
};

export type CreateMealPlanDto = {
  title: string;
  recipes: RecipeEntry[];
};

export type UpdateMealPlanDto = {
  title?: string;
  recipes?: RecipeEntry[];
};
