export type ShoppingItem = {
  name: string;
  quantity: string;
  checked: boolean;
};

export type ShoppingListUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
};

export type ShoppingListResponse = {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  user?: ShoppingListUser;
  items: ShoppingItem[];
  createdAt: string;
};

export type CreateShoppingListDto = {
  items: ShoppingItem[];
};

export type UpdateShoppingListDto = {
  items?: ShoppingItem[];
};
