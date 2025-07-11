export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  author: string;
  tags: string[];
  image: string;
  cookTime: number;
  likes: number;
  views: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "approved" | "rejected";
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type Ingredient = {
  name: string;
  quantity: string;
};
