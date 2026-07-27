import type { ReviewResponse } from "./review";
import type { Author } from "./author";
import type { CategoryResponse } from "./category";

export type IngredientDto = {
  name: string;
  quantity: string;
};

export type RecipeResponse = {
  id: string;
  title: string;
  description?: string;
  ingredients: IngredientDto[];
  steps: string[];
  author: string | Author;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  tags: string[];
  image: string;
  cookTime: number;
  likes?: number;
  likedUserIds?: string[];
  views?: number;
  difficulty: "easy" | "medium" | "hard";
  status?: "pending" | "approved" | "rejected";
  category: string | CategoryResponse;
  reviews?: ReviewResponse[];
  createdAt: string;
  updatedAt: string;
};

export type CreateRecipeDto = {
  title: string;
  description?: string;
  ingredients: IngredientDto[];
  steps: string[];
  tags: string[];
  image: string;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
};

export type UpdateRecipeDto = {
  title?: string;
  description?: string;
  ingredients?: IngredientDto[];
  steps?: string[];
  tags?: string[];
  image?: string;
  cookTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
};
