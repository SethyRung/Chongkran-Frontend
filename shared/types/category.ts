export type CategoryResponse = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryDto = {
  name: string;
  description?: string;
};

export type UpdateCategoryDto = {
  name?: string;
  description?: string;
};
