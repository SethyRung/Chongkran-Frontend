export type PaginatedResponse<T> = {
  content: T[];
  total: number;
  page: number;
  lastPage: number;
};
