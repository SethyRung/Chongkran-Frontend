export type Paginated<T> = {
  content: T[];
  total: number;
  page: number;
  lastPage: number;
};
